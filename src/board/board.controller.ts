import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { validate } from 'class-validator';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // @UseGuards(AuthGuard())
  @Post()
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    // @userInfo user: User
  ) {
    try {
      await validate(createBoardDto);

      return await this.boardService.createBoard(createBoardDto);
    } catch (error) {
      return { message: `${error}` };
    }
  }

  // @UseGuards(AuthGuard())
  // @Get()
  // async findAllBoards() {
  //   @userInfo user: User
  //   try {
  //     return await this.userService.findAllBoardByuserId(user.id);
  //   } catch (error) {
  //     return { message: `${error}` };
  //   }
  // }

  // @UseGuards(AuthGuard())
  @Get('/:boardId')
  async findBoardById(@Param('boardId') boardId: number) {
    try {
      return await this.boardService.findBoardById(boardId);
    } catch (error) {
      return { message: `${error}` };
    }
  }

  // @UseGuards(AuthGuard())
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

  // @UseGuards(AuthGuard())
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
