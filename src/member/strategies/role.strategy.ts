// auth.strategy.ts
import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '../types/role.type';
import { Member } from '../entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
@Injectable()
export class RoleStrategy {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private reflector: Reflector
  ) {}
  async validate(
    userId: number,
    boardId: number,
    context: ExecutionContext
  ): Promise<boolean> {
    const member = await this.memberRepository.findOne({
      where: {
        userId,
        boardId,
      },
    });
    const requiredRole = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    if (!requiredRole) {
      if (member){
        return true
      }
    }
    if (!member) {
      throw new ForbiddenException('권한이 없습니다.');
    }
    const userRole: Role = member.role;
    return requiredRole.includes(userRole); // 1 === Admin_or_Super  true /// false
  }
} // 초대가 되었는지 검증하고 + 권한이 뭔지 까지 검증하는
