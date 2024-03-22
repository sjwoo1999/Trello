import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), PassportModule, JwtAuthGuard, User],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [TypeOrmModule],
})
export class MemberModule {}
