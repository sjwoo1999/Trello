import { PickType } from "@nestjs/mapped-types";
import { User } from "src/user/entities/user.entity";


export class EmailMemberDto extends PickType(User, ['email']){}