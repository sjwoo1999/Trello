import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Columns } from './entities/column.entity';
import { DataSource, Repository } from 'typeorm';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(Columns)
    private readonly columnRepository: Repository<Columns>,
    private dataSource: DataSource,
  ) {}

  async createColumn(createColumnDto: CreateColumnDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const columns = await this.findAllColumns(createColumnDto.boardId);
      let order = 0;

      if (!columns) {
        order = 0;
      } else {
        columns.map((column) => {
          order = Math.max(column.order);
        });
      }
      createColumnDto.order = order;

      await queryRunner.manager.save(Columns, createColumnDto);

      await queryRunner.commitTransaction();

      return { message: '컬럼이 생성되었습니다.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { message: `${error}` };
    } finally {
      await queryRunner.release();
    }
  }

  async findAllColumns(boardId: number) {
    const columns = await this.columnRepository.findBy({ boardId });

    if (!columns) {
      throw new NotFoundException('컬럼을 찾을 수 없습니다.');
    }

    return columns;
  }

  async findColumn(id: number) {
    const column = await this.columnRepository.findOneBy({ id });

    if (!column) {
      throw new NotFoundException('해당 컬럼을 찾을 수 없습니다.');
    }

    return column;
  }

  async editColumn(columnId: number, updateColumnDto: UpdateColumnDto) {
    const column = await this.findColumn(columnId);

    await this.columnRepository.update(column, updateColumnDto);

    return { message: '해당 컬럼을 수정하였습니다.' };
  }
}
