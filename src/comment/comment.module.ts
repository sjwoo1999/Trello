import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/member/entities/member.entity';
import { Card } from 'src/card/entities/card.entity';
import { Columns } from 'src/column/entities/column.entity';
import { RoleStrategy } from 'src/member/strategies/role.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Member, Card, Columns])],
  controllers: [CommentController],
  providers: [CommentService, RoleStrategy],
  exports: [TypeOrmModule],
})
export class CommentModule {}
