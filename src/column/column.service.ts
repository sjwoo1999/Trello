import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Columns } from './entities/column.entity';
import { DataSource, Repository } from 'typeorm';

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

      if ('message' in columns) {
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

  async findAllColumns(boardId) {
    try {
      const columns = await this.columnRepository.findBy({ boardId });

      if (!columns) {
        throw new NotFoundException('컬럼을 찾을 수 없습니다.');
      }

      return columns;
    } catch (error) {
      return { message: `${error}` };
    }
  }
}
