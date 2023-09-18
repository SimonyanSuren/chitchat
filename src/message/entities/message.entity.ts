import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';
import { Channel } from '../../channel/entities/channel.entity';
import { User } from '../../user/entities/user.entity';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ collection: 'messages' })
export class Message {
  @ApiProperty({ type: String, format: 'ObjectId' })
  @Prop({
    virtual: true,
    get: function (this: MessageDocument) {
      return this._id;
    },
    type: mongooseSchema.Types.ObjectId,
  })
  public id: ObjectId;

  @Prop({ type: String, required: true })
  public content: string;

  @ApiProperty({ type: String, format: 'ObjectId' })
  @Prop({ type: mongooseSchema.Types.ObjectId, ref: Message.name, default: null })
  public parentId: ObjectId | null;

  @ApiProperty({ type: String, format: 'ObjectId' })
  @Prop({ type: mongooseSchema.Types.ObjectId, ref: Channel.name })
  public channel: Channel | ObjectId;

  @ApiProperty({ type: String, format: 'ObjectId' })
  @Prop({ type: mongooseSchema.Types.ObjectId, ref: User.name })
  public senderId: ObjectId;

  @Prop({ type: Date, default: Date.now })
  public createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  public updatedAt: Date;

  @Prop({ type: Date, default: null })
  public deletedAt: Date | null;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
