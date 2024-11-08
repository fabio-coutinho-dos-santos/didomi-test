import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../../@domain/users/use-cases/create-user.usecase';
import { CreateUserPresenter } from '../presenters/create-user.presenter';
import { CreateUserDto } from '../dtos/users.dto';

@Controller('users')
export class UsersController {
  @Inject(CreateUserUseCase)
  private readonly createUserUseCase: CreateUserUseCase;

  @Post('')
  async createUser(@Body() input: CreateUserDto): Promise<CreateUserPresenter> {
    return await this.createUserUseCase.execute(input);
  }
}
