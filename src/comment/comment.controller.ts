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

@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 댓글 작성 API 경로
  @Post('card/:cardId/comment')
  async createComment(
    @Param('cardId') cardId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ): Promise<string> {
    const userId = req.user;
    return this.commentService.create(createCommentDto, userId); // 카드 ID와 멤버 권한을 검사하여 댓글 생성
  }

  @Patch(':commentId')
  update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: any,
  ) {
    const userId = req.user;
    return this.commentService.update(+commentId, updateCommentDto, userId);
  }

  @Get('cards/:cardId/comment')
  findAll(@Param('cardId') cardId: string) {
    return this.commentService.findAll(+cardId);
  }

  @Get(':commentId')
  findOne(@Param('commentId') commentId: string) {
    return this.commentService.findOne(+commentId);
  }

  @Delete(':commentId')
  remove(@Param('commentId') commentId: string, @Req() req: any) {
    const userId = req.user;
    return this.commentService.delete(+commentId, userId);
  }
}
