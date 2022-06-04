import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../shared/decorators/public.decorator';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {
  }

  @Public()
  @Post()
  login(@Body() body: {email: string, password: string}): Promise<{token: string}>  {
    return this.authService.login(body.email, body.password);
  }
}
