import { Module } from '@nestjs/common';
import { Card } from './entities/card.entity';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnModule } from 'src/column/column.module';
import { UserModule } from 'src/user/user.module';
//
//import { JwtModule } from '@nestjs/jwt';
//import { ConfigModule, ConfigService } from '@nestjs/config';
//import { JwtStrategy } from 'src/user/strategies/jwt.strategy';

// import { AuthModule } from 'src/auth/auth.module"; -> 일단 제외하고

// Board or Boards, Column or Columns, Card or Cards 어떻게 작성해야 할까?

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    ColumnModule,
    UserModule,
    /*, AuthModule*/
  ],
  controllers: [],
  providers: [],
})
export class CardModule {}
