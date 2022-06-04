import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../shared/decorators/public.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {

  private readonly reflector: Reflector;

  constructor() {
    super();
    this.reflector = new Reflector();
  }

  canActivate(context: ExecutionContext): any {
    return this.isPublic(context) || super.canActivate(context);
  }

  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
