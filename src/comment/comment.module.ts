import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/member/entities/member.entity';
import { Card } from 'src/card/entities/card.entity';
import { Columns } from 'src/column/entities/column.entity';
import { RoleStrategy } from 'src/member/strategies/role.strategy';
import { ColumnService } from 'src/column/column.service';
import { CardService } from 'src/card/card.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { Board } from 'src/board/entities/board.entity';
import { BoardService } from 'src/board/board.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Member, Card, Columns, User, Board]),
    JwtModule.register({}),
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    RoleStrategy,
    ColumnService,
    CardService,
    UserService,
    BoardService,
  ],
  exports: [TypeOrmModule, JwtModule],
})
export class CommentModule {}
