import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { validate } from 'class-validator';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  async createBoard(@Body() createBoardDto: CreateBoardDto, @Req() req: any) {
    await validate(createBoardDto);

    const userId = req.user;
    return await this.boardService.createBoard(createBoardDto, userId);
  }

  @Get('/:boardId')
  async findBoardById(@Param('boardId') boardId: number) {
    try {
      return await this.boardService.findBoardById(boardId);
    } catch (error) {
      return { message: `${error}` };
    }
  }

  @Patch('/:boardId')
  async editBoard(
    @Param('boardId') boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    try {
      await this.boardService.editBoard(boardId, updateBoardDto);

      return { message: '해당 보드를 수정하였습니다.' };
    } catch (error) {
      return { message: `${error}` };
    }
  }

  @Delete('/:boardId')
  async deleteBoard(@Param('boardId') boardId: number) {
    try {
      await this.boardService.deleteBoard(boardId);

      return { message: '해당 보드를 삭제하였습니다.' };
    } catch (error) {
      return { message: `${error}` };
    }
  }
}
