import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/createUser.dto';
import { PatchUserDto } from './dtos/patchUser.dto';
import { SignInDto } from './dtos/signIn.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  //의존성 주입
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  //service.회원가입
  async signUp({
    name,
    email,
    password,
    passwordConfirm,
    rolePassword,
  }: CreateUserDto) {
    //비밀번호 확인
    const isPasswordMatched = password === passwordConfirm;
    if (!isPasswordMatched) {
      throw new BadRequestException(
        '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
      );
    }
    //이메일 확인
    const existedUser = await this.userRepository.findOneBy({ email });
    if (existedUser) {
      throw new BadRequestException('이미 가입 된 이메일입니다.');
    }
    //role 확인
    const role =
      rolePassword === this.configService.get<string>('ROLE_ADMIN_PASSWORD')
        ? 0
        : 1;

    const hashRounds = this.configService.get<number>('PASSWORD_HASH_ROUNDS');
    const hashedPassword = bcrypt.hashSync(password, hashRounds);

    const user: User = await this.userRepository.save({
      name,
      email,
      password: hashedPassword,
      role,
    });
    return this.getToken(user.id);
  }

  async signIn({ email, password }: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });
    const isPasswordMatched = bcrypt.compareSync(
      password,
      user?.password ?? '',
    );

    if (!user || !isPasswordMatched) {
      throw new BadRequestException(
        '사용자가 존재하지 않거나, 비밀번호가 다릅니다.',
      );
    }
    return this.getToken(user.id);
  }

  async getToken(userId: number) {
    const payload = { id: userId };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  async getUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

    async patchUser(userId: number, { name, email, password, newPassword, newPasswordConfirm, rolePassword }: PatchUserDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: { id: true, name: true, email: true, password: true, role: true },
        });
            
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }
    
        if (email && email !== user.email) {
            const existingUser = await this.userRepository.findOne({ where: { email, id: userId } });
            if (existingUser) {
                throw new BadRequestException('이미 사용 중인 이메일 주소입니다.');
            }
            user.email = email;
        }
    
        user.name = name ?? user.name;
    
        if (newPassword || newPasswordConfirm) {
            if (newPassword !== newPasswordConfirm) {
                throw new BadRequestException('새로운 비밀번호와 새로운 비밀번호 확인 값이 다릅니다.');
            }
    
            const hashRounds = this.configService.get<number>('PASSWORD_HASH_ROUNDS');
            const isPasswordMatched = bcrypt.compareSync(password, user.password);
    
            if (!isPasswordMatched) {
                throw new BadRequestException('기존 비밀번호가 올바르지 않습니다.');
            }
    
            const newHashedPassword = bcrypt.hashSync(newPassword, hashRounds);
            user.password = newHashedPassword;
        }

        if (user.role === 1){
            user.role = rolePassword === this.configService.get<string>('ROLE_ADMIN_PASSWORD') ? 0 : 1;
        }

        const checkUser = await this.userRepository.findOne({
            where: { id: userId },
            select: { id: true, name: true, email: true, password: true, role: true },
        });
        const isPasswordNotChanged = bcrypt.compareSync(password, checkUser.password);
        if (user.name===checkUser.name && user.email===checkUser.email && isPasswordNotChanged && user.role===checkUser.role){
            throw new BadRequestException('변경된 값이 없습니다.');
        }

        await this.userRepository.save(user);
        user.password = newPassword;
        await this.userRepository.update(
      { id: userId },
      {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    );
}

  async deleteUser(userId: number) {
    const user = await this.getUser(userId);
    await this.userRepository.delete({ id: user.id });
  }

  // async emailUser(email){
  //   const send
  //     const transporter = nodemailer.createTransport({
  //       service: "GMail", // 메일 서비스 이름
  //       port: 587, // 메일 서버 포트 (보안을 위해 TLS를 지원하는 587 포트 사용을 권장한다)
  //       host: "smtp.gmail.com", // 메일 서버 도메인 또는 IP
  //       secure: true, // TLS 사용 여부
  //       requireTLS: true, // TLS 연결 시도 여부
  //       auth: { // 인증정보 (여기에 연동하고자 하는 GMail의 이메일 주소와 비밀번호를 넣는다)
  //         user:process.env.MAILER_EMAIL,// 환경변수에 정의한 이메일 주소와 비밀번호를 가져온다.
  //         pass:process.env.MAILER_PASSWORD,
  //       },
  //     });
  // }



}


