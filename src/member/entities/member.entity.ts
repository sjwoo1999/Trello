import { IsNumber } from 'class-validator';
import { Board } from 'src/board/entities/board.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'members' })
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column({ type: 'int', nullable: false })
  userId: number;

  @IsNumber()
  @Column({ type: 'int', nullable: false })
  boardId: number;

  @ManyToOne(() => User, (user) => user.members)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: User;

  @ManyToOne(() => Board, (board) => board.members)
  @JoinColumn({ name: "boardId", referencedColumnName: "id" })
  board: Board;
}
