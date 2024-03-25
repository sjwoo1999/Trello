import { PickType } from '@nestjs/mapped-types';
import { Columns } from '../entities/column.entity';

export class CreateColumnDto extends PickType(Columns, [
  'boardId',
  'order',
  'title',
]) {}
