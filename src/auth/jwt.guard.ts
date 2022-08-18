import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../shared/decorators/public.decorator';
import { IS_FREE_KEY } from '../shared/decorators/free.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {

  private readonly reflector: Reflector;

  constructor() {
    super();
    this.reflector = new Reflector();
  }

  /**
   * If @Public then skip validations and return true immediately.
   * Else canActivate() will be called and add IUser object to request if authorized.
   * If @Free then the result of canActivate() will be ignored.
   **/
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) { return true; }
    try { // @ts-ignore
      const canActivatePromise: Promise<boolean> = super.canActivate(context);
      return (await canActivatePromise) || this.isFree(context);
    } catch (e) {
      if (this.isFree(context)) { return true; }
      else { throw e; }
    }
  }

  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private isFree(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_FREE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
