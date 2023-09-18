import { Injectable } from '@nestjs/common';
import { Repositories } from '../database/repositories';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly repositories: Repositories) {}

  public async getUserById(id: ObjectId): Promise<User | null> {
    return this.repositories.USER.findById(id);
  }
}
