import { CustomDecorator, SetMetadata } from '@nestjs/common';

/**
 * Use @Free decorator if you want to get use @User decorator and receive IUser object.
 * If you want just skip validations use @Public decorator.
 */
export const IS_FREE_KEY = 'p9s1fokj23';
export const Free = (): CustomDecorator => SetMetadata(IS_FREE_KEY, true);
