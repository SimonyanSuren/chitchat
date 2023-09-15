import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { validate } from './common/config/env.validation';
import { JwtAccessAuthGuard } from './common/guards';
import { LoggingMiddleware } from './common/middleware/logger.middleware';
import { DataBaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      cache: true,
      isGlobal: true,
    }),
    DataBaseModule,
    AuthModule,
    UserModule,
    ChannelModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessAuthGuard,
    },
  ],
})
export class ApplicationModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
