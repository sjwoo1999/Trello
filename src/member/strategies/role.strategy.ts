// auth.strategy.ts
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '../types/role.type';
import { Member } from '../entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleStrategy {
<<<<<<< HEAD
    constructor(@InjectRepository(Member) private readonly memberRepository: Repository<Member>){}
  async validate(userId: number, boardId: number, requiredRole: Role[]): Promise<boolean> {
    const member = await this.memberRepository.findOne({ 
        where: {
            boardId, 
            userId
        }
=======
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}
  async validate(
    userId: number,
    boardId: number,
    requiredRole: Role,
  ): Promise<boolean> {
    const member = await this.memberRepository.findOne({
      where: {
        boardId,
        userId,
      },
>>>>>>> 29da980e63770153d00690220cc5135d5426af4a
    });
    if (!member){
      throw new ForbiddenException('권한이 없습니다.')
    }
    const userRole: Role = member.role;
    return requiredRole.includes(userRole)// 1 === Admin_or_Super
  }
}
