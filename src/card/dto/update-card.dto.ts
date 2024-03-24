import { PickType } from '@nestjs/mapped-types';
import { Card } from '../entities/card.entity';

export class UpdateCardDto extends PickType(Card, [
  'title',
  'content',
  'category',
  'color',
  'startDate',
  'endDate'
]) {}
