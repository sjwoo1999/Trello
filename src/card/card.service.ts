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
import { Not, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { LexoRank } from 'lexorank';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly usersService: UserService,
  ) {}

  // 마감일이 시작일 이전인지 또는 마감일이 오늘 이전인지 확인(지정된 경우).
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

    // 생성 카드 정의
    const card = this.cardRepository.create(createCardDto);

    // 정의된 카드 repository에 저장
    await this.cardRepository.save(card);

    return { card, message: '카드 생성 완료' };
  }

  async findAll(columnId: number) {
    const foundCard = await this.cardRepository.find({
      where: { columnId },
      select: ['id', 'title'],
      order: { order: 'ASC' },
    });

    return { foundCard, message: '카드 목록 조회 성공' };
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
    // card service
    const card = await this.findOne(id);

    if (card.userId !== userId) {
      throw new UnauthorizedException('해당 카드를 수정할 권한이 없습니다.');
    }

    this.cardRepository.merge(card, updateCardDto);
    const updatedCard = await this.cardRepository.save(card);
    return { updatedCard, message: '카드가 정상적으로 수정되었습니다.' };
  }

  private async availableUserById(userId: number) {
    const user = await this.usersService.getUser(userId);
  }

  // addMemberToCard

  async addMemberToCard(cardId: number, userId: number) {
    const card = await this.findOne(cardId);
    const user = await this.availableUserById(userId);

    // card.workers = [...card.workers, user];

    await this.cardRepository.save(card);

    return { newMember: user, message: '작업자 추가' };
  }

  // updateCardOrder

  async updateCardOrder(columnId: number, cardId: number, rankId: string) {
    const findAllCard = await this.cardRepository.find({
      where: { columnId },
      order: { order: 'ASC' },
    });

    const findIdx = findAllCard.findIndex((card) => {
      return card.order === parseInt(rankId);
    });

    let moveLexoRank: LexoRank;

    if (findIdx === 0) {
      moveLexoRank = LexoRank.parse(
        findAllCard[findIdx].order.toString(),
      ).genPrev();
    } else if (findIdx === findAllCard.length - 1) {
      moveLexoRank = LexoRank.parse(
        findAllCard[findIdx].order.toString(),
      ).genNext();
    } else {
      moveLexoRank = LexoRank.parse(
        findAllCard[findIdx].order.toString(),
      ).between(LexoRank.parse(findAllCard[findIdx - 1].toString()));
    }

    await this.cardRepository.update(
      { id: cardId },
      { order: parseInt(moveLexoRank.toString()) },
    );
  }
}
