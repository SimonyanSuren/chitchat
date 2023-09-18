import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Repositories } from '../database/repositories';
import { CreateChannelDto } from './dto/create.dto';
import { UpdateChannelDto } from './dto/update.dto';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    private readonly repositories: Repositories,
    @InjectConnection() private readonly connection: Connection
  ) {}

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

  public async update(
    channelId: ObjectId,
    updateData: UpdateChannelDto
  ): Promise<Channel | null> {
    return this.repositories.CHANNEL.findOneAndUpdate({ id: channelId }, updateData, {
      new: true,
    });
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
    channelId: ObjectId,
    userId: ObjectId
  ): Promise<Channel | null> {
    return this.repositories.CHANNEL.findOne({
      id: channelId,
      members: { $in: [userId] },
    });
  }

  // Ideal solution will be to implement soft delete for channels and messages instead of hard deleting
  // TODO: Implement soft delete
  public async deleteChanelAndRelatedMessages(id: ObjectId): Promise<void> {
    const session = await this.connection.startSession();
    await session.startTransaction();
    try {
      await this.repositories.CHANNEL.deleteById(id, {
        session,
      });

      await this.repositories.MESSAGE.deleteMany(
        { channel: id },
        {
          session,
        }
      );

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }
}
