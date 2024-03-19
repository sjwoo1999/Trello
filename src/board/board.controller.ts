import { Body, Controller, Post } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { validate } from 'class-validator';

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
}
