import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'w5e9u12ir3';
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);
