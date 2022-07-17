import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import { IUser } from '../profiles/profile';
import { JWT_SECRET } from './auth.secret';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
      ignoreExpiration: false
    });
  }

  validate(user: IUser): IUser {
    return user;
  }

}
