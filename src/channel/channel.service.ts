import { Injectable } from '@nestjs/common';
import { Repositories } from '../database/repositories';
import { CreateChannelDto } from './dto/create.dto';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelService {
  constructor(private readonly repositories: Repositories) {}

  public async create(
    ownerId: ObjectId,
    channelData: CreateChannelDto
  ): Promise<Channel> {
    const { name, memberIds, isPrivate } = channelData;

    const channel = new Channel();
    channel.ownerId = ownerId;
    channel.name = name;
    channel.isPrivate = isPrivate;
    channel.members = [ownerId, ...memberIds];

    return this.repositories.CHANNEL.create(channel);
  }

  public async addMembers(
    channelId: ObjectId,
    membersIds: ObjectId[]
  ): Promise<Channel | null> {
    return this.repositories.CHANNEL.findOneAndUpdate(
      { id: channelId },
      { $addToSet: { members: { $each: membersIds } } },
      { new: true }
    );
  }

  public async findChannelById(id: ObjectId): Promise<Channel | null> {
    return this.repositories.CHANNEL.findById(id);
  }

  public async getChannelsByUserId(userId: ObjectId): Promise<Channel[]> {
    return this.repositories.CHANNEL.find({ members: { $in: [userId] } }).populate(
      'members'
    );
  }

  public async isChannelNameAlreadyExist(
    ownerId: ObjectId,
    name: string
  ): Promise<{ _id: Channel['id'] } | null> {
    return this.repositories.CHANNEL.exists({ ownerId: ownerId, name: name });
  }

  public async findChannelByIdAndUserId(
    id: ObjectId,
    userId: ObjectId
  ): Promise<Channel | null> {
    return this.repositories.CHANNEL.findOne({
      id,
      members: { $in: [userId] },
    });
  }
}
