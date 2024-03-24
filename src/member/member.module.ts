import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { RoleStrategy } from './strategies/role.strategy';
import { RoleGuard } from './guards/role.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Member, User]), PassportModule],
  controllers: [MemberController],
  providers: [MemberService, RoleStrategy, RoleGuard],
  exports: [TypeOrmModule, RoleGuard],
})
export class MemberModule {}
