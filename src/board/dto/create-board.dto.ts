import { PickType } from '@nestjs/mapped-types';
import { Board } from '../entities/board.entity';

export class CreateBoardDto extends PickType(Board, [
  'member',
  'title',
  'content',
  'color',
  'visibility',
]) {}
