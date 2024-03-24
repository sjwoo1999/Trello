import { PickType } from '@nestjs/mapped-types';
import { Card } from '../entities/card.entity';

export class CreateCardDto extends PickType(Card, [
  'id', // 필요 없고
  'columnId',
  'order',
  'userId',
  'title',
  'content',
  'category',
  'color',
  'startDate',
  'endDate',
  'createdAt', // 필요 없고
  'updatedAt', // 필요 없고
]) {}
