import { IsBoolean, IsNumber } from 'class-validator';
import { Board } from 'src/board/entities/board.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'members' })
export class Member {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNumber()
  @Column({ type: 'int', nullable: false })
  boardId: number;

  @IsNumber()
  @Column({ type: 'int', unsigned: true })
  userId: number;

  @IsBoolean()
  @Column({ type: 'boolean' })
  IsAdmin: boolean;

  @ManyToOne(() => User, (user) => user.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Board, (board) => board.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId', referencedColumnName: 'id' })
  board: Board;
}
