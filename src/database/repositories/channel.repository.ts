import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Channel, ChannelDocument } from '../../channel/entities/channel.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class ChannelRepository extends BaseRepository<ChannelDocument> {
  constructor(
    @InjectModel(Channel.name) private readonly channelModel: Model<ChannelDocument>
  ) {
    super(channelModel);
  }
}
