import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async findBoardById(id: number) {
    const board = await this.boardRepository.findOneBy({ id });

    if (!board) {
      throw new NotFoundException('해당 보드를 찾을 수 없습니다.');
    }

    return board;
  }
}
