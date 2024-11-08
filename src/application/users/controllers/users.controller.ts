import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../../@domain/users/use-cases/create-user.usecase';
import { CreateUserPresenter } from '../presenters/create-user.presenter';
import { CreateUserDto } from '../dtos/users.dto';
import { GetAllUsersUseCase } from 'src/@domain/users/use-cases/get-all-users.usecase';
import { User } from 'src/@domain/users/entities/user.entity';

@Controller('users')
export class UsersController {
  @Inject(CreateUserUseCase)
  private readonly createUserUseCase: CreateUserUseCase;

  @Inject(GetAllUsersUseCase)
  private readonly getAllUsersUseCase: GetAllUsersUseCase;

  @Post('')
  async createUser(@Body() input: CreateUserDto): Promise<CreateUserPresenter> {
    return await this.createUserUseCase.execute(input);
  }

  @Get('')
  async getUsers(): Promise<any> {
    const allUsers: any = await this.getAllUsersUseCase.execute();
    return allUsers;
  }
}
