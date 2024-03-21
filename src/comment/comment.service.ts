import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { BoardIdMemberDto } from '../member/dto/boardId-member.dto';

@Injectable()
export class CommentService {
  comments: any[] = []; //댓글 배열 초기화

  // 댓글 작성 메서드
  create(createCommentDto: CreateCommentDto, member: BoardIdMemberDto): string {
    // 보드에 초대된 멤버인지 확인
    if (this.isMemberOfBoard(member)) {
      // 보드에 초대된 멤버인 경우에만 댓글 작성
      const newComment = {
        id: this.comments.length + 1,
        content: createCommentDto.content,
        author: member.userId,
        cardId: createCommentDto.cardId,
      };
      this.comments.push(newComment);
      return '댓글이 성공적으로 작성되었습니다.';
    } else {
      throw new Error('보드에 초대되지 않은 멤버는 댓글을 작성할 수 없습니다.');
    }
  }

  // // 보드에 초대된 멤버인지 확인하는 메서드
  // private isMemberOfBoard(member: BoardIdMemberDto): boolean {
  //   // 보드에 초대된 멤버라고 가정
  //   // 보드에 속한 멤버들의 목록을 확인해야 하는데 모르겠음 ㅠ
  //   return true;
  // }

  // 댓글 조회 메서드
  findAll(): any[] {
    return this.comments;
  }

  // 특정 댓글 조회 메서드
  findOne(commentId: number): any {
    const comment = this.comments.find((comment) => comment.id === commentId);
    if (!comment) {
      throw new Error('해당 ID의 댓글을 찾을 수 없습니다.');
    }
    return comment;
  }

  // 댓글 수정 메서드
  update(commentId: number, updateCommentDto: any): string {
    const commentIndex = this.comments.findIndex(
      (comment) => comment.id === commentId,
    );
    if (commentIndex === -1) {
      throw new Error('해당 ID의 댓글을 찾을 수 없습니다.');
    }
    this.comments[commentIndex].content = updateCommentDto.content;
    return '댓글이 성공적으로 수정되었습니다.';
  }

  // 댓글 삭제 메서드
  delete(commentId: number): string {
    const commentIndex = this.comments.findIndex(
      (comment) => comment.id === commentId,
    );
    if (commentIndex === -1) {
      throw new Error('해당 ID의 댓글을 찾을 수 없습니다.');
    }
    this.comments.splice(commentIndex, 1);
    return '댓글이 성공적으로 삭제되었습니다.';
  }
}
