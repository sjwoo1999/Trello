import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Columns } from './entities/column.entity';
import { Repository } from 'typeorm';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(Columns)
    private readonly columnRepository: Repository<Columns>,
  ) {}

  async createColumn(createColumnDto: CreateColumnDto) {
    const columns = await this.findAllColumns(createColumnDto.boardId);
    let order = 0;

    if (!columns) {
      order = 0;
    } else {
      columns.map((column) => {
        order = Math.max(column.order) + 1;
      });
    }
    createColumnDto.order = order;

    await this.columnRepository.save(createColumnDto);

    return { message: '컬럼이 생성되었습니다.' };
  }

  async findAllColumns(boardId: number) {
    const columns = await this.columnRepository.findBy({ boardId });

    return columns;
  }

  async findColumnById(id: number) {
    const column = await this.columnRepository.findOneBy({ id });

    if (!column) {
      throw new NotFoundException('해당 컬럼을 찾을 수 없습니다.');
    }

    return column;
  }

  async editColumn(columnId: number, updateColumnDto: UpdateColumnDto) {
    const column = await this.findColumnById(columnId);

    const editColumn = await this.columnRepository.update(
      column,
      updateColumnDto,
    );

    return editColumn;
  }

  async deleteColumn(columnId: number) {
    const column = await this.findColumnById(columnId);

    const deleteColumn = await this.columnRepository.delete(column);

    return deleteColumn;
  }
}
