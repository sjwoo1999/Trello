import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/createUser.dto';
import { PatchUserDto } from './dtos/patchUser.dto'
import { SignInDto } from './dtos/signIn.dto';
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    //의존성 주입
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectRepository(User) private readonly userRepository: Repository<User>){}
    
    //service.회원가입
    async signUp({name, email, password, passwordConfirm, rolePassword}:CreateUserDto){
        //비밀번호 확인
        const isPasswordMatched = password === passwordConfirm;
        if (!isPasswordMatched){
          throw new BadRequestException(
            '비밀번호와 비밀번호 확인이 일치하지 않습니다.'
          );
        }
        //이메일 확인
        const existedUser = await this.userRepository.findOneBy({email});
        if (existedUser){
            throw new BadRequestException(
                '이미 가입 된 이메일입니다.'
            )
        }
        //role 확인
        const role = rolePassword === this.configService.get<string>('ROLE_ADMIN_PASSWORD') ? 0 : 1;
    
        const hashRounds = this.configService.get<number>('PASSWORD_HASH_ROUNDS');
        const hashedPassword = bcrypt.hashSync(password, hashRounds);
    
        const user:User = await this.userRepository.save({ name, email, password:hashedPassword, role})
        return this.getToken(user.id);
    }

    async signIn({email, password}:SignInDto){
        const user = await this.userRepository.findOne(
            {
              where:{email},
              select:{id: true, password: true},
            });
        const isPasswordMatched = bcrypt.compareSync(password, user?.password ?? '');
      
        if (!user||!isPasswordMatched){
            throw new BadRequestException('사용자가 존재하지 않거나, 비밀번호가 다릅니다.')
        }
        return this.getToken(user.id);
    }

    async getToken(userId:number){
        const payload = {id : userId};
        const accessToken = this.jwtService.sign(payload)
        return accessToken;

    }

    async getUser(userId: number){
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user){
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }
        return user;
    }

    async patchUser(userId: number, {name, email, password, newPassword, newPasswordConfirm}:PatchUserDto){
        const user = await this.getUser(userId)
        user.name = name ?? user.name; 
        user.email = email ?? user.email;
        if (password === newPassword || newPassword !== newPasswordConfirm){
            throw new BadRequestException('바꿀 비밀번호 값이 기존과 같거나, 확인값이 다릅니다.')
        }
        user.password = newPassword;
        await this.userRepository.update({id : userId}, {
            name: user.name,
            email: user.email,
            password: user.password
        })
    }

    async deleteUser(userId: number){
        const user = await this.getUser(userId);
        await this.userRepository.delete({id: user.id});
    }
}