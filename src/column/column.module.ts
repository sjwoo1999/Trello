import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Columns } from './entities/column.entity';
import { BoardModule } from 'src/board/board.module';
import { UserModule } from 'src/user/user.module';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [TypeOrmModule.forFeature([Columns]), BoardModule, UserModule, MemberModule],
  controllers: [ColumnController],
  providers: [ColumnService],
})
export class ColumnModule {}
