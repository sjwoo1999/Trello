import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MemberService } from './member.service';
import { EmailMemberDto } from './dto/email-member.dto';
import { BoardIdMemberDto } from './dto/boardId-member.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  //board 생성하면 동시에 멤버 생성도 해주셔야될거같아서 생성한사람은 role === super 해주시면

  //멤버 초대
  @Post()
  invite(@Body() emailMemberDto:EmailMemberDto) {
    return this.memberService.invite(emailMemberDto);
  }

  //접근 가능한 보드 조회
  @Get()
  boardCanAccess() {
    return this.memberService.boardCanAccess();
  }

  //멤버 리스트 조회
  @Get()
  accessMembers(boardMemberDto:BoardIdMemberDto) {
    return this.memberService.accessMembers(boardMemberDto);
  }

  // 권한 +-인가
  @Patch()
  patchMemberRole(emailMemberDto:EmailMemberDto) {
    return this.memberService.patchMemberRole(emailMemberDto);
  }

  //보드 탈퇴.
  @Delete(':id')
  boardOut(boardMemberDto:BoardIdMemberDto) {
    return this.memberService.boardOut(boardMemberDto);
  }

  //멤버 강퇴
  @Delete(':id')
  boardKick(emailMemberDto:EmailMemberDto) {
    return this.memberService.boardKick(emailMemberDto);
  }
}
