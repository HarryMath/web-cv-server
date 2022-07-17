import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Profile } from '../profiles/profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './auth.strategy';
import { ConfigModule } from '@nestjs/config';
import { GithubService } from './github.service';
import { JWT_SECRET } from './auth.secret';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([Profile]),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '60m' }
    })
  ],
  providers: [GithubService, AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
