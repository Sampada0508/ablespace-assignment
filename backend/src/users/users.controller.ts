import { Body, Controller, Post } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('guest')
  async createGuest(@Body() createGuestDto: CreateGuestDto) {
    return this.usersService.createGuestUser(createGuestDto.guestId);
  }
}