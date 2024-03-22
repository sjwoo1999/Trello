import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Member } from 'src/member/entities/member.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    private dataSource: DataSource,
  ) {}

  async findBoardById(id: number) {
    const board = await this.boardRepository.findOneBy({ id });

    if (!board) {
      throw new NotFoundException('해당 보드를 찾을 수 없습니다.');
    }

    return board;
  }

  async createBoard(createBoardDto: CreateBoardDto, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const board = await queryRunner.manager.save(Board, createBoardDto);

      await queryRunner.manager.save(Member, {
        userId: userId,
        boardId: board.id,
        role: 0,
      });

      await queryRunner.commitTransaction();

      return { message: '보드가 생성되었습니다.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { message: `${error}` };
    } finally {
      await queryRunner.release();
    }
  }

  async editBoard(boardId: number, updateBoardDto: UpdateBoardDto) {
    await this.findBoardById(boardId);

    return await this.boardRepository.update({ id: boardId }, updateBoardDto);
  }

  async deleteBoard(boardId: number) {
    await this.findBoardById(boardId);

    return await this.boardRepository.delete({ id: boardId });
  }
}
