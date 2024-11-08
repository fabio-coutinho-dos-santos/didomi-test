import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../../@domain/users/use-cases/create-user.usecase';
import { CreateUserPresenter } from '../presenters/create-user.presenter';
import { CreateUserDto } from '../dtos/users.dto';
import { User } from 'src/@domain/users/entities/user.entity';

@Controller('users')
export class UsersController {
  @Inject(CreateUserUseCase)
  private readonly createUserUseCase: CreateUserUseCase;

  @Post('')
  async createUser(@Body() input: CreateUserDto): Promise<CreateUserPresenter> {
    return await this.createUserUseCase.execute(input);
  }
}
