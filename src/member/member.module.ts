import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { RoleStrategy } from './strategies/role.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Member, User]), PassportModule],
  controllers: [MemberController],
  providers: [MemberService, RoleStrategy],
  exports: [TypeOrmModule],
})
export class MemberModule {}
