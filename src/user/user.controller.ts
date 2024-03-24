import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { SignInDto } from './dtos/signIn.dto';
import { CreateUserDto } from './dtos/createUser.dto';
import { PatchUserDto } from './dtos/patchUser.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { MemberService } from 'src/member/member.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly memberService: MemberService
  ) {}

  @Post('/sign-up')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.userService.signUp(createUserDto);
    res.cookie('authorization', `Bearer ${accessToken}`);
    return {
      statusCode: HttpStatus.CREATED,
      message: '회원가입에 성공했습니다.',
    };
  }

  @Post('/sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.userService.signIn(signInDto);
    res.cookie('authorization', `Bearer ${accessToken}`);
    return {
      statusCode: HttpStatus.OK,
      message: '로그인에 성공했습니다.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/info')
  async getUser(@Request() req){
    const userId = req.user.id; //
    const data = await this.userService.getUser(userId);
    return {
        statusCode: HttpStatus.OK,
        message: '정보 조회에 성공했습니다.',
        data,
    }
  }

  //접근 가능한 보드 조회 ..
  @UseGuards(JwtAuthGuard)
  @Get('/activate')
  async boardCanAccess(@Request() req) {
    const userId = req.user.id;
    const data = await this.memberService.boardCanAccess(userId);
    return {
      statusCode: HttpStatus.OK,
      message: '조회에 성공했습니다.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/patch')
  async patchUser(@Request() req, @Body() patchUser: PatchUserDto) {
    const userId = req.user.id;
    await this.userService.patchUser(userId, patchUser);
    return {
      statusCode: HttpStatus.OK,
      message: '유저 정보를 수정했습니다.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/leave')
  async deleteUser(@Request() req) {
    const userId = req.user.id;
    await this.userService.deleteUser(userId);
    return {
      statusCode: HttpStatus.OK,
      message: '탈퇴가 완료되었습니다.',
    };
  }
}
