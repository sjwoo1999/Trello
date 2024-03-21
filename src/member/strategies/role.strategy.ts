// auth.strategy.ts
import { Injectable } from '@nestjs/common';
import { Role } from '../types/role.type';
import { Member } from '../entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleStrategy {
    constructor(@InjectRepository(Member) private readonly memberRepository: Repository<Member>){}
  async validate(userId: number, boardId: number, requiredRole: Role): Promise<boolean> {
    const member = await this.memberRepository.findOne({ 
        where: {
            boardId, 
            userId
        }
    });
    const userRole: Role = member.role;
    return userRole === requiredRole;
  }
}
