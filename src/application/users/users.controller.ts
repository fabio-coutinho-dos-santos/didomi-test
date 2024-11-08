import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateUserDto } from '../../@domain/users/dtos/users.dto';
import { IUsersRepository } from '../../@domain/users/repositories/users.repository.interface';
import { User } from '../../@domain/users/entities/user.entity';
import { CreateUserUseCase } from 'src/@domain/users/use-cases/create-user.usecase';
import { UserPresenter } from 'src/@domain/users/presenters/create-user.presenter';

@Controller('users')
export class UsersController {
  @Inject('IUsersRepository')
  private readonly usersRepository: IUsersRepository;

  @Inject(CreateUserUseCase)
  private readonly createUserUseCase: CreateUserUseCase;

  @Post('')
  async createUser(@Body() input: CreateUserDto): Promise<UserPresenter> {
    return await this.createUserUseCase.execute(input);
  }
}
