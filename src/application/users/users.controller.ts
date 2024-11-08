import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateUserDto } from '../../@domain/users/dtos/users.dto';
import { IUsersRepository } from '../../@domain/users/repositories/users.repository.interface';
import { User } from '../../@domain/users/entities/user.entity';

@Controller('users')
export class UsersController {
  @Inject('IUsersRepository')
  private readonly usersRepository: IUsersRepository;

  @Post('')
  async createUser(@Body() input: CreateUserDto): Promise<any> {
    const { email } = input;
    const user = new User(email);
    console.log('user', user);
    await this.usersRepository.create(user);
  }
}
