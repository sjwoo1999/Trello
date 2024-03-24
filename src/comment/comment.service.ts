import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from 'src/card/entities/card.entity';
import { Columns } from 'src/column/entities/column.entity';
import { Member } from 'src/member/entities/member.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(Columns)
    private readonly columnRepository: Repository<Columns>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  // 댓글 작성 메서드
  async create(
    createCommentDto: CreateCommentDto,
    userId: number,
    cardId: number,
  ): Promise<{ message: string; comment: Comment }> {
    const newComment = {
      content: createCommentDto.content,
      userId: userId,
      cardId: cardId,
    };
    console.log(newComment);
    const createdComment = await this.commentRepository.save(newComment);
    return {
      message: '댓글이 성공적으로 작성되었습니다.',
      comment: createdComment,
    };
    // await this.commentRepository.save(newComment);
    // return '댓글이 성공적으로 작성되었습니다.';
  }

  // 댓글 조회 메서드
  async findAll(cardId: number): Promise<Comment[]> {
    console.log('카드 ID:', +cardId); // 카드 ID 확인을 위한 로그 추가
    return await this.commentRepository.find({ where: { cardId: cardId } });
  }

  // 특정 댓글 조회 메서드
  async findOne(commentId: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('해당 ID의 댓글을 찾을 수 없습니다.');
    }
    return comment;
  }

  // 댓글 수정 메서드
  async update(
    commentId: number,
    updateCommentDto: any,
    userId: number,
  ): Promise<{ message: string; comment: Comment }> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('해당 ID의 댓글을 찾을 수 없습니다.');
    }
    if (comment.userId !== userId) {
      throw new BadRequestException('수정할 권한이 없습니다.');
    }

    await this.commentRepository.update(commentId, updateCommentDto);
    const updatedComment = await this.commentRepository.findOne({
      where: { id: commentId },
    }); // 수정된 댓글 조회
    if (!updatedComment) {
      throw new NotFoundException('수정된 댓글을 찾을 수 없습니다.');
    }
    return {
      message: '댓글이 성공적으로 수정되었습니다.',
      comment: updatedComment,
    };

    // await this.commentRepository.update(commentId, updateCommentDto);
    // return '댓글이 성공적으로 수정되었습니다.';
  }

  // 댓글 삭제 메서드
  async delete(
    commentId: number,
    userId: number,
  ): Promise<{ message: string }> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('해당 ID의 댓글을 찾을 수 없습니다.');
    }
    if (comment.userId !== userId) {
      throw new BadRequestException('삭제할 권한이 없습니다.');
    }

    const result = await this.commentRepository.delete(commentId);
    console.log('삭제 결과', result);
    return { message: '댓글이 성공적으로 삭제되었습니다.' };
  }
}
