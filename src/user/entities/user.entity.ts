import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../types/user.type';
import { Card } from 'src/card/entities/card.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Member } from 'src/member/entities/member.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ type: 'varchar', length: 30, nullable: false })
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;

  @IsEmail()
  @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @Column({ type: 'varchar', select: false, nullable: false })
  @IsNotEmpty({ message: '비밀번호을 입력해주세요.' })
  password: string;

  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.user })
  role: Role;

  @OneToMany(() => Card, (card) => card.user)
  cards: Card[];

  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Member, (member) => member.user, { cascade: true })
  members: Member[];
}
