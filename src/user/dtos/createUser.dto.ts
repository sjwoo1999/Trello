import { PickType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";
import { IsNotEmpty, IsString } from "class-validator";
import { Column } from "typeorm";

export class CreateUserDto extends PickType(User, [
    'name',
    'email',
    'password',
]) {
    @IsString()
    @Column({ type: 'varchar', select: false, nullable: false })
    @IsNotEmpty({ message: '확인 비밀번호을 입력해주세요.' })
    passwordConfirm: string;

    @Column({ type: 'varchar', default: null, nullable: true })
    rolePassword: string;
}