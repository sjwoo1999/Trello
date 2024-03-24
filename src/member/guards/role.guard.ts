import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../types/role.type';
import { RoleStrategy } from '../strategies/role.strategy';
import { ROLES_KEY } from '../decorators/role.decorator';


@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private strategy: RoleStrategy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    (requiredRole);
    if (!requiredRole) {
      return true; // @Roles 데코레이터가 없는 경우에는 모든 사용자가 접근 가능
    }
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const boardId = request.body.boardId; // << 만약에 카드아이디가 들어오면 그걸통해 보드아이디를 가져오는 걸 작성하시면 되겠죠!
    return await this.strategy.validate(userId, boardId, requiredRole);
  }
}