import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { EmailMemberDto } from './dto/emailMember.dto';
import { Role } from './types/role.type';
import { RoleGuard } from './guards/role.guard';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';
import { Roles } from './decorators/role.decorator';
import { PatchRoleDto } from './dto/updateRole.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('member') // 뭘로 할지 회의 필요
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  //board 생성하면 동시에 멤버 생성도 해주셔야될거같아서 생성한사람은 role === super 해주시면
  // /host3000/:boardId/invite
  //멤버 초대
  @Roles(Role.ADMIN, Role.SUPER)
  @Post('/:boardId/invite')
  async invite(
    @Request() req,
    @Param('boardId') boardId: number,
    @Body() emailMemberDto: EmailMemberDto,
  ) {
    const userId = req.user.id;
    await this.memberService.invite(userId, boardId, emailMemberDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '초대에 성공했습니다.',
    };
  }

  // 보드 안에 있는 멤버 조회
  @Roles(Role.USER, Role.ADMIN, Role.SUPER)
  @Get('/:boardId/allmembers')
  async accessMembers(@Param('boardId') boardId: number) {
    const data = await this.memberService.accessMembers(boardId);
    return {
      statusCode: HttpStatus.OK,
      message: '조회에 성공했습니다.',
      data,
    };
  }

  // 권한 +-인가
  @Roles(Role.SUPER)
  @Patch('/:boardId/managerole')
  async patchMemberRole(
    @Request() req,
    @Param('boardId') boardId: number,
    @Body() patchRoleDto: PatchRoleDto,
  ) {
    await this.memberService.patchMemberRole(boardId, patchRoleDto);
    return {
      statusCode: HttpStatus.OK,
      message: '권한 변경에 성공했습니다.',
    };
  }

  //보드 탈퇴.
  @Roles(Role.USER, Role.ADMIN, Role.SUPER)
  @Delete('/:boardId/leave')
  async boardLeave(@Request() req, @Param('boardId') boardId: number) {
    const userId = req.user.id;
    await this.memberService.boardLeave(userId, boardId);
    return {
      statusCode: HttpStatus.OK,
      message: '보드 탈퇴가 완료되었습니다.',
    };
  }

  //멤버 강퇴
  @Roles(Role.ADMIN, Role.SUPER)
  @Delete('/:boardId/kick')
  async boardKick(
    @Request() req,
    @Param('boardId') boardId: number,
    @Body() emailMemberDto: EmailMemberDto,
  ) {
    console.log(emailMemberDto);
    const userId = req.user.id;
    await this.memberService.boardKick(userId, boardId, emailMemberDto);
    return {
      statusCode: HttpStatus.OK,
      message: '강제 퇴장이 완료되었습니다.',
    };
  }
}
