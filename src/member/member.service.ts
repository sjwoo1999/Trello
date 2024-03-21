import { Injectable } from '@nestjs/common';
import { EmailMemberDto } from './dto/email-member.dto';
import { BoardIdMemberDto } from './dto/boardId-member.dto';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MemberService {
  constructor(@InjectRepository(Member) private readonly memberRepository:Repository<Member>){}
  invite(emailMemberDto:EmailMemberDto) {

  }

  boardCanAccess() {

  }

  accessMembers(boardMemberDto:BoardIdMemberDto) {

  }

  patchMemberRole(emailMemberDto:EmailMemberDto) {

  }

  boardOut(boardMemberDto:BoardIdMemberDto) {

  }

  boardKick(emailMemberDto:EmailMemberDto) {

  }


  searchUser(){

  }


  isJoinBoard(){

  }
}
