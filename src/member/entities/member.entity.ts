import { IsEnum, IsNumber } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../types/role.type";
import { User } from "src/user/entities/user.entity";
import { Board } from "src/board/entities/board.entity";


@Entity({ name: 'members' })
export class Member {

  @PrimaryGeneratedColumn()
  id: number;
    
  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @IsNumber()
  @Column({ type: 'int'})
  userId: number;

  @IsNumber()
  @Column({ type: 'int'})
  boardId: number;

  @ManyToOne(() => User, (user) => user.members, {onDelete: 'CASCADE'})
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: User;

  @ManyToOne(() => Board, (board) => board.members, {onDelete: 'CASCADE'})
  @JoinColumn({ name: "boardId", referencedColumnName: "id" })
  board: Board;

}
