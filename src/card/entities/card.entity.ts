import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Color } from '../types/color.type';
import { Category } from '../types/category.type';
import { User } from 'src/user/entities/user.entity';
import { Columns } from 'src/column/entities/column.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity({ name: 'cards' })
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column({ type: 'int', nullable: false })
  columnId: number;

  @IsNumber()
  @Column({ type: 'int', nullable: false })
  order: number;

  @IsNumber()
  @Column({ type: 'int' })
  userId: number;

  @IsString()
  @Column({ type: 'varchar', length: 30, nullable: false })
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  title: string;

  @IsString()
  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  content: string;

  @IsEnum(Category, { message: '카테고리를 선택해주세요.' })
  @Column({ type: 'enum', enum: Category, nullable: false })
  category: Category;

  @IsEnum(Color)
  @Column({ type: 'enum', enum: Color, default: Color.black })
  color: Color;

  @Column({ type: 'date', nullable: false })
  @IsDateString({}, { message: '올바른 시작 날짜를 입력해주세요.' })
  @IsNotEmpty({ message: '시작 날짜를 입력해주세요.' })
  startDate: Date;

  @Column({ type: 'date', nullable: false })
  @IsDateString({}, { message: '올바른 종료 날짜를 입력해주세요.' })
  @IsNotEmpty({ message: '종료 날짜를 입력해주세요.' })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.card)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.cards)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Columns, (column) => column.cards)
  @JoinColumn({ name: 'columnId', referencedColumnName: 'id' })
  column: Columns;
}
