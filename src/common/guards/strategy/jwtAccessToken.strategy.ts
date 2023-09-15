import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Algorithm } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../../../auth/auth.service';
import { JwtPayload } from '../../../auth/interfaces/jwtPayload.interface';
import { User } from '../../../user/entities/user.entity';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'access-token') {
  constructor(
    protected readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => request?.cookies?.Access || null,
      ]),
      secretOrKey: configService.get<string>('jwtConfig.JWT_ACCESS_TOKEN_SECRET'),
      algorithms: [
        configService.get<string>('jwtConfig.ENCRYPTION_ALGORITHM'),
      ] as Algorithm[],
      jsonWebTokenOptions: {
        jwtid: configService.get<string>('jwtConfig.JWT_ACCESS_TOKEN_ID'),
      },
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.authService.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.active) {
      throw new UnauthorizedException('User is not active');
    }

    return user;
  }
}
