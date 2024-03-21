import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column({ type: 'int', nullable: false })
  cardId: number;

  @IsNumber()
  @Column({ type: 'int' })
  userId: number;

  @IsString()
  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Card, (card) => card.comments)
  @JoinColumn({ name: 'cardId', referencedColumnName: 'id' })
  card: Card;
}
