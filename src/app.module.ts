import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModuleOptions, TypeOrmModule } from '@nestjs/typeorm';
import { BoardModule } from './board/board.module';
import { ColumnModule } from './column/column.module';
import { CardModule } from './card/card.module';
import { CommentModule } from './comment/comment.module';
import Joi from 'joi';
import { User } from './user/entities/user.entity';
import { Board } from './board/entities/board.entity';
import { Columns } from './column/entities/column.entity';
import { Card } from './card/entities/card.entity';
import { Comment } from './comment/entities/comment.entity';
import { Member } from './member/entities/member.entity';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [User, Board, Columns, Card, Comment, Member],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
        PASSWORD_HASH_ROUNDS: Joi.number().required(),
        ROLE_ADMIN_PASSWORD: Joi.string().required(),
        MAILER_EMAIL: Joi.string().required(),
        MAILER_PASSWORD: Joi.string().required()
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    UserModule,
    BoardModule,
    ColumnModule,
    CardModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
