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
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(
    protected readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => request?.cookies?.Refresh || null,
      ]),
      secretOrKey: configService.get<string>('jwtConfig.JWT_REFRESH_TOKEN_SECRET'),
      algorithms: [
        configService.get<string>('jwtConfig.ENCRYPTION_ALGORITHM'),
      ] as Algorithm[],
      jsonWebTokenOptions: {
        jwtid: configService.get<string>('jwtConfig.JWT_REFRESH_TOKEN_ID'),
      },
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  public async validate(request: Request, payload: JwtPayload): Promise<User> {
    const user = await this.authService.validateRefreshToken(
      payload.sub,
      request.cookies.Refresh
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
