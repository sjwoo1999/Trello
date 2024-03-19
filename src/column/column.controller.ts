import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { BoardService } from 'src/board/board.service';

@Controller('/board/:boardId/column')
export class ColumnController {
  constructor(
    private readonly columnService: ColumnService,
    private readonly boardService: BoardService,
  ) {}

  @Post()
  async createColumn(
    @Param('boardId') boardId: number,
    @Body() createColumn: CreateColumnDto,
  ) {
    await this.boardService.findBoardById(boardId);
    createColumn.boardId = boardId;

    await this.columnService.createColumn(createColumn);
  }

  @Get()
  async findAllColumn() {}
}
