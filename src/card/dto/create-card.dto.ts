import { PickType } from '@nestjs/mapped-types';
import { Card } from '../entities/card.entity';

export class CreateCardDto extends PickType(Card, [
<<<<<<< HEAD
  'id', // 필요 없고
=======
>>>>>>> f2c38f29e167720291ecd999f0316c2a48dcdddc
  'columnId',
  'order',
  'userId',
  'title',
  'content',
  'category',
  'color',
  'startDate',
<<<<<<< HEAD
  'endDate',
  'createdAt', // 필요 없고
  'updatedAt', // 필요 없고
=======
  'endDate'
>>>>>>> f2c38f29e167720291ecd999f0316c2a48dcdddc
]) {}
