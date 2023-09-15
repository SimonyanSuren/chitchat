import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';
import { UserRoles } from '../roles/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users' })
export class User {
  @ApiProperty({ type: String, format: 'ObjectId' })
  @Prop({
    virtual: true,
    get: function (this: UserDocument) {
      return this._id;
    },
    type: mongooseSchema.Types.ObjectId,
  })
  public id: ObjectId;

  @Prop({ type: String, required: true, unique: true })
  public email: string;

  @Prop({ type: String, required: true })
  public firstName: string;

  @Prop({ type: String, required: true })
  public lastName: string;

  @Prop({ required: true, enum: UserRoles, default: UserRoles.USER })
  public role: UserRoles;

  @Exclude()
  @ApiHideProperty()
  @Prop({ type: String, required: true, select: false })
  public password: string;

  @Exclude()
  @ApiHideProperty()
  @Prop({ type: String, default: null, select: false })
  public refreshToken: string | null;

  @Prop({ type: Boolean, default: true })
  public active: boolean;

  @Prop({ type: Boolean, default: false })
  public emailConfirmed: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  @Exclude()
  public lastLogin: Date;

  @Prop({ type: Date, default: Date.now })
  public createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  public updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
