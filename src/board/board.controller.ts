import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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

      // createBoardDto.member.push(user.id);
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
  //     return boards;
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
      return await this.boardService.editBoard(boardId, updateBoardDto);
    } catch (error) {
      return { message: `${error}` };
    }
  }
}
