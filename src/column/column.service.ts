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

  async changeOrderColumn(boardId: number, columnId: number, order: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const columns = await this.findAllColumns(boardId);
      const column = await this.findColumnById(columnId);

      const reorderColumns = await this.reorder(columns, column.order, order);

      await queryRunner.manager.save(Columns, reorderColumns);

      const changeOrderColumns = await this.findAllColumns(boardId);
      await queryRunner.commitTransaction();

      return changeOrderColumns;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { message: `${error}` };
    } finally {
      await queryRunner.release();
    }
  }

  async reorder(columns: Columns[], order: number, reorder: number) {
    const reorderColumns = columns.map((column) => {
      if (reorder < order) {
        if (column.order >= reorder && column.order < order) {
          return { ...column, order: column.order + 1 };
        } else if (column.order === order) {
          return { ...column, order: reorder };
        }
      } else {
        if (column.order > order && column.order <= reorder) {
          return { ...column, order: column.order - 1 };
        } else if (column.order === order) {
          return { ...column, order: reorder };
        }
      }
    });

    return reorderColumns;
  }
}
