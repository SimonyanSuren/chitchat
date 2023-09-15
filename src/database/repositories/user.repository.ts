import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../user/entities/user.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
    super(userModel);
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    return this._model.findOne({ email }).exec();
  }

  public async findUserByEmailWithPass(email: string): Promise<User | null> {
    return this._model.findOne({ email }).select('+password').exec();
  }
}
