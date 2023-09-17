import { Injectable } from '@nestjs/common';
import { ChannelRepository } from './channel.repository';
import { MessageRepository } from './message.repository';
import { UserRepository } from './user.repository';

@Injectable()
export class Repositories {
  constructor(
    public readonly USER: UserRepository,
    public readonly CHANNEL: ChannelRepository,
    public readonly MESSAGE: MessageRepository
  ) {}
}

export { UserRepository } from './user.repository';
export { ChannelRepository } from './channel.repository';
export { MessageRepository } from './message.repository';
