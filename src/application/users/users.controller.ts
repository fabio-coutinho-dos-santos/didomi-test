import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateUserDto } from '../../@domain/users/dtos/users.dto';
import { CreateUserUseCase } from 'src/@domain/users/use-cases/create-user.usecase';
import { CreateUserPresenter } from 'src/@domain/users/presenters/create-user.presenter';

@Controller('users')
export class UsersController {
  @Inject(CreateUserUseCase)
  private readonly createUserUseCase: CreateUserUseCase;

  @Post('')
  async createUser(@Body() input: CreateUserDto): Promise<CreateUserPresenter> {
    return await this.createUserUseCase.execute(input);
  }
}
