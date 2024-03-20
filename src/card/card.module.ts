import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Board } from "./entites/board.entity";
// import { Column } from "./entities/column.entity";
import { Card } from './entities/card.entity';
// import { AuthModule } from 'src/auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([/*Board, Column, */ Card]) /*AuthModule*/,
  ],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
