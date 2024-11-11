import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../../@domain/users/use-cases/create-user.usecase';
import {
  CreateUserPresenter,
  UserPresenter,
  UsersPresenter,
} from '../presenters/users.presenter';
import { CreateUserDto } from '../dtos/users.dto';
import { GetAllUsersUseCase } from '../../../@domain/users/use-cases/get-all-users.usecase';
import { DeleteUserUseCase } from '../../../@domain/users/use-cases/delete-user.usecase';
import { DeleteUserDto } from '../dtos/delete-user.dto';
import { User } from '../../../@domain/users/entities/user.entity';
import { GetUserByIdUseCase } from '../../../@domain/users/use-cases/get-user-by-id.usecase';
import { GetUserByIdDto } from '../dtos/get-user-by-id.dto';

@Controller('users')
export class UsersController {
  @Inject(CreateUserUseCase)
  private readonly createUserUseCase: CreateUserUseCase;

  @Inject(GetAllUsersUseCase)
  private readonly getAllUsersUseCase: GetAllUsersUseCase;

  @Inject(DeleteUserUseCase)
  private readonly deleteUserUseCase: DeleteUserUseCase;

  @Inject(GetUserByIdUseCase)
  private readonly getUserByIdUseCase: GetUserByIdUseCase;

  @Post('')
  async createUser(@Body() input: CreateUserDto): Promise<CreateUserPresenter> {
    const user = await this.createUserUseCase.execute(input);
    return CreateUserPresenter.toResponse(user);
  }

  @Get(':id')
  async getUser(@Param() input: GetUserByIdDto): Promise<UsersPresenter> {
    const user: User = await this.getUserByIdUseCase.execute(input);
    return UserPresenter.toResponse(user);
  }

  @Get('')
  async getUsers(): Promise<UsersPresenter> {
    try {
      const allUsers: User[] = await this.getAllUsersUseCase.execute();
      return UsersPresenter.toResponse(allUsers);
    } catch (err) {
      Logger.error(err);
      throw err;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param() input: DeleteUserDto): Promise<void> {
    await this.deleteUserUseCase.execute(input);
  }
}
