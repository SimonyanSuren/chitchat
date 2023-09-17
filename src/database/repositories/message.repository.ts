import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../../message/entities/message.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class MessageRepository extends BaseRepository<MessageDocument> {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>
  ) {
    super(messageModel);
  }
}
