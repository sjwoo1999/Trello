import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { BoardIdMemberDto } from '../member/dto/boardId-member.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 댓글 작성 API 경로
  @Post('cards/:cardId/comment')
  createComment(
    @Param('cardId') cardId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Body() member: BoardIdMemberDto,
  ): string {
    return this.commentService.create(createCommentDto, member); // 카드 ID와 멤버 권한을 검사하여 댓글 생성
  }

  @Patch('card/:cardId/comment/:commentId')
  update(
    @Param('cardId') cardId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Body() member: BoardIdMemberDto,
  ) {
    return this.commentService.update(+commentId, updateCommentDto);
  }

  @Get('')
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':commentId')
  findOne(@Param('commentId') commentId: string) {
    return this.commentService.findOne(+commentId);
  }

  @Delete('card/:cardId/comment/:commentId')
  remove(
    @Param('commentId') commentId: string,
    @Body() member: BoardIdMemberDto,
  ) {
    return this.commentService.delete(+commentId);
  }
}

// function UserDetails(): (
//   target: CommentController,
//   propertyKey: 'createComment',
//   parameterIndex: 2,
// ) => void {
//   throw new Error('Function not implemented.');
// }

// function User(): (
//   target: CommentController,
//   propertyKey: 'createComment',
//   parameterIndex: 2,
// ) => void {
//   throw new Error('Function not implemented.');
// }
