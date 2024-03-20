import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Put,
} from '@nestjs/common';
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

  // @UseGuards(AuthGuard())
  @Post()
  async createColumn(
    @Param('boardId') boardId: number,
    @Body() createColumn: CreateColumnDto,
  ) {
    try {
      await validate(createColumn);

      await this.boardService.findBoardById(boardId);
      createColumn.boardId = boardId;

      await this.columnService.createColumn(createColumn);
    } catch (error) {
      return { message: `${error}` };
    }
  }

  // @UseGuards(AuthGuard())
  @Get()
  async findAllColumns(@Param('boardId') boardId: number) {
    try {
      await this.boardService.findBoardById(boardId);

      await this.columnService.findAllColumns(boardId);
    } catch (error) {
      return { message: `${error}` };
    }
  }

  // @UseGuards(AuthGuard())
  @Patch('/:columnId')
  async editColumn(
    @Param('boardId') boardId: number,
    @Param('columnId') columnId: number,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    try {
      await this.boardService.findBoardById(boardId);

      await this.columnService.editColumn(columnId, updateColumnDto);

      return { message: '해당 컬럼을 수정하였습니다.' };
    } catch (error) {
      return { message: `${error}` };
    }
  }

  // @UseGuards(AuthGuard())
  @Delete('/:columnId')
  async deleteColumn(
    @Param('boardId') boardId: number,
    @Param('columnId') columnId: number,
  ) {
    try {
      await this.boardService.findBoardById(boardId);

      await this.columnService.deleteColumn(columnId);

      return { message: '해당 컬럼을 삭제하였습니다,' };
    } catch (error) {
      return { message: `${error}` };
    }
  }

  // @UseGuards(AuthGuard())
  @Put('/:columnId')
  async changeOrderColumn(
    @Param('boardId') boardId: number,
    @Param('columnId') columnId: number,
    @Body() order: number,
  ) {
    await this.boardService.findBoardById(boardId);

    return await this.columnService.changeOrderColumn(boardId, columnId, order);
  }
}
