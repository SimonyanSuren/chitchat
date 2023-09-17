import { Injectable } from '@nestjs/common';
import { Repositories } from '../database/repositories';
import { SendMessageDto } from './dto/send.dto';
import { Message } from './entities/message.entity';
import { UpdateMessageDto } from './dto/update.dto';

@Injectable()
export class MessageService {
  constructor(private readonly repositories: Repositories) {}

  public async create(
    channelId: ObjectId,
    senderId: ObjectId,
    messageData: SendMessageDto
  ): Promise<Message> {
    const { content, parentId } = messageData;

    const message = new Message();
    message.content = content.trim();
    message.channel = channelId;
    message.senderId = senderId;
    message.parentId = parentId;

    return this.repositories.MESSAGE.create(message);
  }

  public async update(
    messageId: ObjectId,
    updateData: UpdateMessageDto
  ): Promise<Message | null> {
    return this.repositories.MESSAGE.findOneAndUpdate(
      { id: messageId },
      { content: updateData.content },
      { new: true }
    );
  }

  public async findMessageByIdAndChannelId(
    id: ObjectId,
    channelId: ObjectId
  ): Promise<Message | null> {
    return this.repositories.MESSAGE.findOne({ id, channel: channelId });
  }

  public async getMessagesByChannelId(channelId: ObjectId): Promise<Message[]> {
    return this.repositories.MESSAGE.find({ channel: channelId });
  }

  //public async isChannelNameAlreadyExist(
  //  ownerId: ObjectId,
  //  name: string
  //): Promise<{ _id: Channel['id'] } | null> {
  //  return this.repositories.CHANNEL.exists({ ownerId: ownerId, name: name });
  //}

  //public async findChannelByUserId(
  //  id: ObjectId,
  //  userId: ObjectId
  //): Promise<Channel | null> {
  //  return this.repositories.CHANNEL.findOne({ id, members: { $in: [userId] } });
  //}
}
