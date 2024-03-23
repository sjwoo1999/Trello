import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';
import { RoleGuard } from 'src/member/guards/role.guard';
import { Roles } from 'src/member/decorators/role.decorator';
import { Role } from 'src/member/types/role.type';
// 추가 시작
import { BoardService } from 'src/board/board.service';
import { ColumnService } from 'src/column/column.service';
// 추가 끝

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 댓글 작성 API 경로
  @Roles(Role.USER, Role.ADMIN, Role.SUPER)
  @Post('card/:cardId/comment')
  async createComment(
    @Param('cardId') cardId: number,
    // 추가 시작
    @Param('boardId') boardId: number,
    // 추가 끝
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ): Promise<string> {
    const userId = req.user.id;
    return this.commentService.create(createCommentDto, userId, cardId); // 카드 ID와 멤버 권한을 검사하여 댓글 생성
  }

  @Patch(':commentId')
  update(
    @Param('commentId') commentId: number,
    // 추가 시작
    @Param('boardId') boardId: number,
    // 추가 끝
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.commentService.update(+commentId, updateCommentDto, userId);
  }

  @Get('cards/:cardId/comment')
  findAll(
    @Param('cardId')
    cardId: number,
    // 추가 시작
    @Param('boardId')
    boardId: number,
    // 추가 끝
  ) {
    return this.commentService.findAll(+cardId);
  }

  @Get(':commentId')
  findOne(
    @Param('commentId') commentId: number,
    // 추가 시작
    @Param('boardId')
    boardId: number,
    // 추가 끝
  ) {
    return this.commentService.findOne(+commentId);
  }

  @Delete(':commentId')
  remove(
    @Param('commentId') commentId: number,
    // 추가 시작
    @Param('boardId') boardId: number,
    // 추가 끝
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.commentService.delete(+commentId, userId);
  }
}
