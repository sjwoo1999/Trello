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

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('card/:cardId/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 댓글 작성 API 경로
  @Roles(Role.USER, Role.ADMIN, Role.SUPER)
  @Post('/write')
  async createComment(
    @Param('cardId') cardId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ) {
    // : Promise<string>
    const userId = req.user.id;
    const { message, comment } = await this.commentService.create(
      createCommentDto,
      userId,
      +cardId,
    );
    return { message, comment }; // 작성된 댓글 객체와 함께 메시지를 반환합니다.
    // return this.commentService.create(createCommentDto, userId, +cardId);
  }

  @Patch(':commentId')
  async update(
    @Param('commentId') commentId: number,

    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const { message, comment } = await this.commentService.update(
      +commentId,
      updateCommentDto,
      userId,
    );
    return { message, comment }; // 수정된 댓글 객체와 함께 메시지를 반환합니다.
    // return this.commentService.update(+commentId, updateCommentDto, userId);
  }

  @Get('/list')
  findAll(
    @Param('cardId')
    cardId: number,
  ) {
    return this.commentService.findAll(+cardId);
  }

  @Get(':commentId')
  async findOne(@Param('commentId') commentId: number) {
    return this.commentService.findOne(+commentId);
  }

  @Delete(':commentId')
  remove(@Param('commentId') commentId: number, @Req() req: any) {
    const userId = req.user.id;
    return this.commentService.delete(+commentId, userId);
  }
}
