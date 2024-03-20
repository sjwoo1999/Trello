import { PartialType } from '@nestjs/mapped-types';
import { Card } from '../entities/card.entity';

export class UpdateCardDto extends PartialType(Card) {}
