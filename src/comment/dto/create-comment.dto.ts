export class CreateCommentDto {
  readonly content: any; // 댓글 내용
  readonly cardId: number; // 댓글이 연결된 카드의 Id
}
