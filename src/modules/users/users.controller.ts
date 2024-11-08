import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../@core/domain/users/users.dto';

@Controller('users')
export class UsersController {
  @Post('')
  async createUser(@Body() input: CreateUserDto): Promise<any> {
    return 'User created';
  }
}
