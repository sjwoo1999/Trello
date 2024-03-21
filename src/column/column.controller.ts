import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { BoardService } from 'src/board/board.service';
import { validate } from 'class-validator';
import { UpdateColumnDto } from './dto/update-column.dto';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
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
    try {
      await validate(createColumn);

      await this.boardService.findBoardById(+boardId);
      createColumn.boardId = +boardId;

      return await this.columnService.createColumn(createColumn);
    } catch (error) {
      return { message: `${error}` };
    }
  }

  @Get()
  async findAllColumns(@Param('boardId') boardId: number) {
    try {
      await this.boardService.findBoardById(+boardId);

      return await this.columnService.findAllColumns(+boardId);
    } catch (error) {
      return { message: `${error}` };
    }
  }

  @Patch('/:columnId')
  async editColumn(
    @Param() params: { boardId: number; columnId: number },
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    try {
      await this.boardService.findBoardById(params.boardId);

      await this.columnService.editColumn(params.columnId, updateColumnDto);

      return { message: '해당 컬럼을 수정하였습니다.' };
    } catch (error) {
      return { message: `${error}` };
    }
  }

  @Delete('/:columnId')
  async deleteColumn(@Param() params: { boardId: number; columnId: number }) {
    try {
      await this.boardService.findBoardById(params.boardId);

      return await this.columnService.deleteColumn(
        params.boardId,
        params.columnId,
      );
    } catch (error) {
      return { message: `${error}` };
    }
  }

  @Put('/:columnId')
  async changeOrderColumn(
    @Param() params: { boardId: number; columnId: number },
    @Body() order: number,
  ) {
    await this.boardService.findBoardById(params.boardId);

    return await this.columnService.changeOrderColumn(
      params.boardId,
      params.columnId,
      order,
    );
  }
}
