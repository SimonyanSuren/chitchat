import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';
import { Channel, ChannelSchema } from '../channel/entities/channel.entity';
import { Message, MessageSchema } from '../message/entities/message.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { mongooseBaseSchemaOptionsPlugin } from './baseSchemaOptions';
import {
  ChannelRepository,
  MessageRepository,
  Repositories,
  UserRepository,
} from './repositories';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MongooseModuleOptions => ({
        uri: configService.get<string>('databaseConfig.MONGODB_URI'),
        user: configService.get<string>('databaseConfig.MONGODB_USER'),
        pass: configService.get<string>('databaseConfig.MONGODB_PASS'),
        dbName: configService.get<string>('databaseConfig.MONGODB_NAME'),
        authSource: configService.get<string>('databaseConfig.MONGODB_NAME'),
        replicaSet: configService.get<string>('databaseConfig.MONGODB_REPLICA_SET_NAME'),
        autoIndex: true,
        autoCreate: true,
        connectionFactory: (connection: Connection): Connection => {
          connection.plugin(mongooseBaseSchemaOptionsPlugin);
          connection.plugin(mongooseLeanVirtuals);
          return connection;
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Channel.name, schema: ChannelSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  providers: [Repositories, UserRepository, ChannelRepository, MessageRepository],
  exports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Channel.name, schema: ChannelSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    Repositories,
  ],
})
export class DataBaseModule {}
