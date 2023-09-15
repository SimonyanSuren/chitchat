import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { isEmail } from 'class-validator';
import { Strategy } from 'passport-local';
import { AuthService } from './../../../auth/auth.service';
import { User } from './../../../user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    if (!isEmail(email)) {
      throw new BadRequestException('Email is not valid.');
    }
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    } else if (!user.emailConfirmed) {
      throw new UnauthorizedException('Email not confirmed.');
    }

    return user;
  }
}
