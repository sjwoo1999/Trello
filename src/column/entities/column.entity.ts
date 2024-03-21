import { IsNotEmpty, IsString } from 'class-validator';
import { Board } from 'src/board/entities/board.entity';
import { Card } from 'src/card/entities/card.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'columns' })
export class Columns {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  boardId: number;

  @Column({ type: 'int', nullable: false })
  order: number;

  @IsString()
  @Column({ type: 'varchar', length: 30, nullable: false })
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  title: string;

  @OneToMany(() => Card, (card) => card.column)
  cards: Card[];

  @ManyToOne(() => Board, (board) => board.columns)
  @JoinColumn({ name: 'boardId', referencedColumnName: 'id' })
  board: Board;
}
