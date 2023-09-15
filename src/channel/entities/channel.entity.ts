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

  @Prop({ type: Boolean, required: true, default: false })
  public isPrivate: boolean;

  @Prop({ type: User, ref: User.name })
  public members: User[];

  //@ApiProperty({ type: String, format: 'ObjectId' })
  //@Prop({ type: mongooseSchema.Types.ObjectId, required: true, index: true })
  //public sportId: ObjectId;

  @Prop({ type: Date, default: Date.now })
  public createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  public updatedAt: Date;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
