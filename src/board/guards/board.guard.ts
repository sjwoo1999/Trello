import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';
import { RoleGuard } from 'src/member/guards/role.guard';
import { BoardService } from '../board.service';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/member/decorators/role.decorator';
import { Role } from 'src/member/types/role.type';

@Injectable()
export class BoardGuard implements CanActivate {
  constructor(
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly roleGuard: RoleGuard,
    private readonly boardService: BoardService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    await this.jwtAuthGuard.canActivate(context);

    const board = await this.boardService.findBoardById(req.boardId);

    const requiredRole = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    
    if (board.visibility === 'Public') {
      if (requiredRole) {
        return await this.roleGuard.canActivate(context);
      } else {
        return true;
      }
    } else if (board.visibility === 'Private') {
        return await this.roleGuard.canActivate(context);
    }
  }
}
