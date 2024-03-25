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

    if (columns.length === 0) {
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
    const columns = await this.columnRepository.find({
      where: { boardId: boardId },
      order: { order: 'ASC' },
    });

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

  async deleteColumn(boardId: number, columnId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const column = await this.findColumnById(columnId);
      const columns = await this.findAllColumns(boardId);

      const reorderColumns = await this.deleteReorder(columns, column.order);

      await queryRunner.manager.delete(Columns, column);
      await queryRunner.manager.save(Columns, reorderColumns);

      await queryRunner.commitTransaction();

      return { message: '해당 컬럼을 삭제하였습니다.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { message: `${error}` };
    } finally {
      await queryRunner.release();
    }
  }

  async deleteReorder(columns: Columns[], order: number) {
    const reorderColumns = columns
      .filter((column) => column.order > order)
      .map((column) => ({ ...column, order: column.order - 1 }));
    return reorderColumns;
  }

  async changeOrderColumn(boardId: number, columnId: number, order: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const columns = await this.findAllColumns(boardId);
      const column = await this.findColumnById(columnId);

      if (columns.length <= order) {
        throw new Error('전체 컬럼의 수보다 큰 값으로 이동할 수 없습니다.');
      }

      const reorderColumns = await this.reorder(columns, column.order, order);

      await queryRunner.manager.save(Columns, reorderColumns);

      await queryRunner.commitTransaction();

      const newColumns = await this.findAllColumns(boardId);

      return newColumns;
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
    const newColumns = reorderColumns.filter((column) => column !== undefined);

    return newColumns;
  }
}
