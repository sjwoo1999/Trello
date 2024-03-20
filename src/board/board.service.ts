import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

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

  async createBoard(createBoardDto: CreateBoardDto) {
    return await this.boardRepository.save(createBoardDto);
  }

  async editBoard(boardId: number, updateBoardDto: UpdateBoardDto) {
    await this.findBoardById(boardId);

    const editBoard = await this.boardRepository.update(
      { id: boardId },
      updateBoardDto,
    );

    return editBoard;
  }
}
