import { PickType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Column } from "typeorm";

export class PatchUserDto extends PickType(User, [
    'password',
]) {
    @Column({ type: 'varchar', length: 30, default : null})
    name: string;
  
    @Column({ type: 'varchar', length: 30, default : null})
    email: string;
  
    @Column({ type: 'varchar', default : null})
    newPassword: string;

    @Column({ type: 'varchar', default : null })
    newPasswordConfirm: string;

    @Column({ type: 'varchar', default: null, nullable: true })
    rolePassword: string;
}