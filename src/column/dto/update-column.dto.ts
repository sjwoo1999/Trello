import { PickType } from '@nestjs/mapped-types';
import { Columns } from '../entities/column.entity';

export class UpdateColumnDto extends PickType(Columns, ['title']) {}
