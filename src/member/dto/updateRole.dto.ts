import { PickType } from "@nestjs/mapped-types";
import { PatchRole } from "../types/patchRole.type";
import { User } from "src/user/entities/user.entity";
import { IsEnum, IsNotEmpty } from "class-validator";

export class PatchRoleDto extends PickType(User, ['email']){
    @IsEnum(PatchRole)
    @IsNotEmpty({ message: 'patchRole을 적어주세요.' })
    patchRole : PatchRole
}