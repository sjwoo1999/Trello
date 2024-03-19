import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { BoardService } from 'src/board/board.service';
import { validate } from 'class-validator';
import { UpdateColumnDto } from './dto/update-column.dto';

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
    await validate(createColumn);

    await this.boardService.findBoardById(boardId);
    createColumn.boardId = boardId;

    await this.columnService.createColumn(createColumn);
  }

  @Get()
  async findAllColumns(@Param('boardId') boardId: number) {
    try {
      await this.boardService.findBoardById(boardId);

      await this.columnService.findAllColumns(boardId);
    } catch (error) {
      return { message: `${error}` };
    }
  }

  @Patch('/:columnId')
  async editColumn(
    @Param('boardId') boardId: number,
    @Param('columnId') columnId: number,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    try {
      await this.boardService.findBoardById(boardId);

      await this.columnService.editColumn(columnId, updateColumnDto);
    } catch (error) {
      return { message: `${error}` };
    }
  }
}
