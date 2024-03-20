import { PickType } from '@nestjs/mapped-types';
import { Card } from '../entities/card.entity';

export class CreateCardDto extends PickType(Card, [
  'id',
  'columnId',
  'order',
  'userId',
  'title',
  'content',
  'category',
  'color',
  'startDate',
  'endDate',
  'createdAt',
  'updatedAt',
]) {}
