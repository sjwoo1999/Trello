import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private dataSource: DataSource,
  ) {}

  async create(createCardDto: CreateCardDto) {
    if (
      createCardDto.startDate &&
      createCardDto.endDate &&
      (createCardDto.endDate < createCardDto.startDate ||
        createCardDto.endDate < new Date())
    ) {
      throw new BadRequestException(
        '마감일은 시작일 이후이거나 오늘 이후여야 합니다.',
      );
    }

    const findCard = await this.cardRepository.findOne({
      where: { columnId: createCardDto.columnId },
      order: { order: 'DESC'}
    })

    if (!findCard) {
      createCardDto.order = 0;
    } else {
      createCardDto.order = findCard.order + 1;
    }

    const card = this.cardRepository.create(createCardDto);

    await this.cardRepository.save(card);

    return { card, message: '카드 생성 완료' };
  }

  async findAll(columnId: number) {
    const foundCard = await this.cardRepository.find({
      where: { columnId },
      select: ['id', 'title', 'order'],
      order: { order: 'ASC' },
    });

    return foundCard;
  }

  async findOne(id: number) {
    const card = await this.cardRepository.findOneBy({ id });

    if (!card) {
      throw new NotFoundException('해당 Card는 존재하지 않습니다.');
    }

    return card;
  }

  async remove(id: number, userId: number) {
    const card = await this.findOne(id);

    if (card.userId !== userId) {
      throw new UnauthorizedException('해당 카드를 삭제할 권한이 없습니다.');
    }

    const result = await this.cardRepository.delete(id);
    return { result, message: 'Card 삭제 완료' };
  }

  async update(userId:number, id: number, updateCardDto: UpdateCardDto) {
    const card = await this.findOne(id);

    if (card.userId !== userId) {
      throw new UnauthorizedException('해당 카드를 수정할 권한이 없습니다.');
    }

    this.cardRepository.merge(card, updateCardDto);
    const updatedCard = await this.cardRepository.save(card);
    return { updatedCard, message: '카드가 정상적으로 수정되었습니다.' };
  }

  async updateCardOrder(columnId: number, cardId: number, order: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cards = await this.findAll(columnId);
      const card = await this.findOne(cardId);

      if (cards.length <= order) {
        throw new Error('전체 카드의 수보다 큰 값으로 이동할 수 없습니다.');
      }
      
      const reorderCards = await this.reorder(cards, card.order, order);

      await queryRunner.manager.save(Card, reorderCards);

      await queryRunner.commitTransaction();

      const newCards = await this.findAll(columnId);

      return newCards;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { message: `${error}` };
    } finally {
      await queryRunner.release();
    }
  }

  async reorder(cards: Card[], order: number, reorder: number) {
    const reorderCards = cards.map((card) => {
      if (reorder < order) {
        if (card.order >= reorder && card.order < order) {
          return { ...card, order: card.order + 1 };
        } else if (card.order === order) {
          return { ...card, order: reorder };
        }
      } else {
        if (card.order > order && card.order <= reorder) {
          return { ...card, order: card.order - 1 };
        } else if (card.order === order) {
          return { ...card, order: reorder };
        }
      }
    });
    const newCards = reorderCards.filter((card) => card !== undefined);

    return newCards;
  }
}
