import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EmailMemberDto } from './dto/emailMember.dto';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { PatchRoleDto } from './dto/updateRole.dto';
import { PatchRole } from './types/patchRole.type';
import { Role } from './types/role.type';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(User) private readonly userRepository:Repository<User>,
    @InjectRepository(Member) private readonly memberRepository:Repository<Member>){}
  async invite(userId: number, boardId: number, {email}:EmailMemberDto) {
    const user = await this.isSignUp(email);
    if (!user){
      throw new BadRequestException('사용자가 존재하지 않습니다.')
    }
    const member = await this.isJoinBoard(user.id, boardId)
    if (member){
      throw new BadRequestException('이미 가입되어있는 사용자입니다.')
    }
    await this.memberRepository.save({ userId: user.id, boardId, role: Role.USER })
  }

  async boardCanAccess(userId: number) {
    const members = await this.memberRepository.find({where:{userId}});
    return members.map(member => member.boardId);
  }

  async accessMembers(boardId: number) {
    const members = await this.memberRepository.find({
      where: {boardId},
      relations: ['user']
    });
    const emails =  members.map(member => member.user.email);
    return emails;
  }

  async patchMemberRole(boardId: number, {email, patchRole}:PatchRoleDto) {
    const user = await this.isSignUp(email);
    if (!user){
      throw new BadRequestException('사용자가 없습니다.')
    }
    const member = await this.isJoinBoard(user.id, boardId)
    if (!member){
      throw new BadRequestException('사용자가 보드에 없습니다.')
    }
    if(member.role===Role.SUPER){
      throw new BadRequestException('이 권한은 변경 할 수 없습니다.')
    }
    if (patchRole === PatchRole.Up){
      member.role = Role.ADMIN
    }
    if (patchRole === PatchRole.Down){
      member.role = Role.USER
    }
    await this.memberRepository.save(member)
  }

  async boardLeave(userId: number, boardId: number) {
    const member = await this.isJoinBoard(userId, boardId)
    if (!member){
      throw new BadRequestException('사용자가 보드에 없습니다.')
    }
    if (member.role === Role.SUPER){
      throw new BadRequestException('총 권한을 가진 유저는 나갈 수 없습니다.')
    }
    await this.memberRepository.delete({userId, boardId})
  }

  async boardKick(userId: number, boardId: number, {email}:EmailMemberDto) {
    console.log(email)
    const user = await this.isSignUp(email);
    if (!user){
      throw new BadRequestException('사용자가 없습니다.')
    }
    const member = await this.isJoinBoard(user.id, boardId)
    if (!member){
      throw new BadRequestException('사용자가 보드에 없습니다.')
    }
    if (member.role === Role.SUPER){
      throw new BadRequestException('이 권한을 가진 유저는 강제퇴장 시킬 수 없습니다.')
    }
    const nowUser = await this.isJoinBoard(userId, boardId);
    if (nowUser.role === member.role){
      throw new BadRequestException('같은 권한을 가진 유저는 강제퇴장 시킬 수 없습니다.')
    }
      await this.memberRepository.delete(member)
  }


  async isSignUp(email:string){
    return await this.userRepository.findOne({where:{email}})
  }


  async isJoinBoard(userId:number, boardId:number){
    return await this.memberRepository.findOne({where:{userId, boardId}})
  }
}
