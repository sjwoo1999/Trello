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
import { BoardGuard } from './guards/board.guard';
import { Roles } from 'src/member/decorators/role.decorator';
import { Role } from 'src/member/types/role.type';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBoard(@Body() createBoardDto: CreateBoardDto, @Req() req: any) {
    await validate(createBoardDto);

    const userId = req.user;
    return await this.boardService.createBoard(createBoardDto, userId);
  }

  @UseGuards(BoardGuard)
  @Get('/:boardId')
  async findBoardById(@Param('boardId') boardId: number) {
    try {
      return await this.boardService.findBoardById(boardId);
    } catch (error) {
      return { message: `${error}` };
    }
  }

  @UseGuards(BoardGuard)
  @Roles(Role.SUPER, Role.SUPER)
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

  @UseGuards(BoardGuard)
  @Roles(Role.SUPER, Role.SUPER)
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
