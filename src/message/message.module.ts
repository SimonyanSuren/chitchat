import { Module } from '@nestjs/common';
import { ChannelModule } from '../channel/channel.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [ChannelModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
