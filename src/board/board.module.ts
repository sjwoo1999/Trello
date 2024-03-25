import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { MemberModule } from 'src/member/member.module';
import { UserModule } from 'src/user/user.module';
import { BoardGuard } from './guards/board.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Board]), MemberModule, UserModule],
  controllers: [BoardController],
  providers: [BoardService, BoardGuard],
  exports: [BoardService, BoardGuard],
})
export class BoardModule {}
