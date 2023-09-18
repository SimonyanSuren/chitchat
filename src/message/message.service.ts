import { Injectable } from '@nestjs/common';
import { Repositories } from '../database/repositories';
import { SendMessageDto } from './dto/send.dto';
import { UpdateMessageDto } from './dto/update.dto';
import { Message } from './entities/message.entity';

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

  // Ideal solution will be to implement soft delete messages instead of hard deleting
  // TODO: Implement soft delete
  public async delete(id: ObjectId): Promise<Message | null> {
    return this.repositories.MESSAGE.deleteById(id);
  }
}
