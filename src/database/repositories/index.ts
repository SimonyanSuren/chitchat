import { Injectable } from '@nestjs/common';
import { ChannelRepository } from './channel.repository';
import { UserRepository } from './user.repository';

@Injectable()
export class Repositories {
  constructor(
    public readonly USER: UserRepository,
    public readonly CHANNEL: ChannelRepository
  ) {}
}

export { ChannelRepository } from './channel.repository';
export { UserRepository } from './user.repository';
