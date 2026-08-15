import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createGuestUser(guestId: string): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ guestId });

    if (existingUser) {
      return existingUser;
    }

    const user = new this.userModel({
      name: 'Guest User',
      guestId,
    });

    return user.save();
  }
}