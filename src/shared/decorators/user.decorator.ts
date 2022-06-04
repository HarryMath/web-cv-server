import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '../../profiles/profile';

export const User = createParamDecorator((
  (data: string, context: ExecutionContext): IUser => {
    const request = context.switchToHttp().getRequest();
    const user: IUser = request.user;

    console.log('user is: ', user);

    return data ? user?.[data] : user;
  })
);
