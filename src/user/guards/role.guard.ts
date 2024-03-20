import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from './jwt.guard';
import { Role } from '../types/user.type';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  @InjectRepository(User) private readonly userRepository: Repository<User>;

  constructor(private reflector: Reflector) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticated = await super.canActivate(context);

    if (!authenticated) {
      throw new UnauthorizedException('인증 정보가 잘못 되었습니다.');
    }
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const userId = req.user.id;
    const user = await this.userRepository.findOneBy({ id: userId });

    const hasPermission = requiredRoles.some((role) => role === user.role);

    if (!hasPermission) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    return hasPermission;
  }
}
