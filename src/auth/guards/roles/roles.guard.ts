import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthenticatedRequest, Role } from 'src/app.dto';
import { ROLES_KEY } from 'src/auth/decorators/role.decorator';
import { InvariantException } from 'src/common/exceptions/invariant.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request: AuthenticatedRequest = context.switchToHttp().getRequest();

    if (!request.user) throw new InvariantException('User role not found');

    const hasRequiredRole = requiredRoles.some(
      (role) => request.user.role === role,
    );

    return hasRequiredRole;
  }
}
