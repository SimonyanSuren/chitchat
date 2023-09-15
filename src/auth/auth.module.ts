import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Algorithm } from 'jsonwebtoken';
import { JwtAccessTokenStrategy, JwtRefreshTokenStrategy } from '../common/guards';
import { LocalStrategy } from '../common/guards/strategy/local.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwtConfig.JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          jwtid: configService.get<string>('jwtConfig.JWT_ACCESS_TOKEN_ID'),
          algorithm: configService.get<string>(
            'jwtConfig.ENCRYPTION_ALGORITHM'
          ) as Algorithm,
          expiresIn: configService.get<number>(
            'jwtConfig.JWT_ACCESS_TOKEN_EXPIRATION_TIME'
          ),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}

export { AuthService } from './auth.service';
