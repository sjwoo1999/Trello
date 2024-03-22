import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
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

  comments: any[] = []; //댓글 배열 초기화

  // 댓글 작성 메서드
  async create(
    createCommentDto: CreateCommentDto,
    userId: number,
  ): Promise<string> {
    //cardId로 bordId 찾기
    const card = await this.cardRepository.findOne({
      where: { id: createCommentDto.cardId },
    });
    const column = await this.columnRepository.findOne({
      where: { id: card.columnId },
    });
    console.log(card);
    // 보드에 초대된 멤버인지 확인
    if (this.isMemberOfBoard(userId, column.boardId)) {
      // 보드에 초대된 멤버인 경우에만 댓글 작성
      const newComment = {
        content: createCommentDto.content,
        user: { id: userId },
        cardId: createCommentDto.cardId,
      };
      console.log(newComment);
      await this.commentRepository.save(newComment);
      return '댓글이 성공적으로 작성되었습니다.';
    } else {
      throw new Error('보드에 초대되지 않은 멤버는 댓글을 작성할 수 없습니다.');
    }
  }

  // 보드에 초대된 멤버인지 확인하는 메서드
  async isMemberOfBoard(userId: number, boardId: number): Promise<boolean> {
    const member = await this.memberRepository.findOne({
      where: { userId, boardId },
    });
    if (member) return true;
    return false;
  }

  // 댓글 조회 메서드
  async findAll(cardId: number): Promise<Comment[]> {
    return await this.commentRepository.findBy({ cardId });
  }

  // 특정 댓글 조회 메서드
  async findOne(commentId: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new Error('해당 ID의 댓글을 찾을 수 없습니다.');
    }
    return comment;
  }

  // 댓글 수정 메서드
  async update(
    commentId: number,
    updateCommentDto: any,
    userId: number,
  ): Promise<string> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new Error('해당 ID의 댓글을 찾을 수 없습니다.');
    }
    if (comment.userId !== userId) {
      throw new Error('삭제할 권한이 없습니다.');
    }

    await this.commentRepository.update(commentId, updateCommentDto);
    return '댓글이 성공적으로 수정되었습니다.';
  }

  // 댓글 삭제 메서드
  async delete(commentId: number, userId: number): Promise<string> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new Error('해당 ID의 댓글을 찾을 수 없습니다.');
    }
    if (comment.userId !== userId) {
      throw new Error('삭제할 권한이 없습니다.');
    }

    const result = await this.commentRepository.delete(commentId);
    console.log('삭제 결과', result);
    return '댓글이 성공적으로 삭제되었습니다.';
  }
}
