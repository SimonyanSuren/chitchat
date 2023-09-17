import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';
import { User } from '../../user/entities/user.entity';

export type ChannelDocument = HydratedDocument<Channel>;

@Schema({ collection: 'channels' })
export class Channel {
  @ApiProperty({ type: String, format: 'ObjectId' })
  @Prop({
    virtual: true,
    get: function (this: ChannelDocument) {
      return this._id;
    },
    type: mongooseSchema.Types.ObjectId,
  })
  public id: ObjectId;

  @Prop({ type: String, required: true })
  public name: string;

  @Prop({ type: Boolean, required: true, default: false })
  public isPrivate: boolean;

  @ApiProperty({ type: User, isArray: true, format: 'ObjectId' })
  @Prop({
    type: [
      {
        type: mongooseSchema.Types.ObjectId,
        ref: User.name,
      },
    ],
  })
  public members: ObjectId[];

  @ApiProperty({ type: String, format: 'ObjectId' })
  @Prop({
    type: mongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  public ownerId: ObjectId;

  @Prop({ type: Date, default: Date.now })
  public createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  public updatedAt: Date;

  @Prop({ type: Date, default: null })
  public deletedAt: Date | null;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);

// Compound index for each user and channel name
// Each user must have a unique channel name
ChannelSchema.index({ name: 1, ownerId: 1 }, { unique: true });
