import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channel/channel.module';
import { validate } from './common/config/env.validation';
import { JwtAccessAuthGuard } from './common/guards';
import { LoggingMiddleware } from './common/middleware/logger.middleware';
import { DataBaseModule } from './database/database.module';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      cache: true,
      isGlobal: true,
    }),
    RouterModule.register([
      {
        path: 'channel',
        module: ChannelModule,
        children: [
          {
            path: ':channelId',
            module: MessageModule,
          },
        ],
      },
    ]),
    DataBaseModule,
    AuthModule,
    UserModule,
    ChannelModule,
    MessageModule,
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
