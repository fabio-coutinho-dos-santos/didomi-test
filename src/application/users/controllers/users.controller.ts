import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../../@domain/users/use-cases/create-user.usecase';
import {
  CreateUserPresenter,
  UsersPresenter,
} from '../presenters/create-user.presenter';
import { CreateUserDto } from '../dtos/users.dto';
import { GetAllUsersUseCase } from 'src/@domain/users/use-cases/get-all-users.usecase';
import { DeleteUserUseCase } from 'src/@domain/users/use-cases/delete-user.usecase';
import { DeleteUserDto } from '../dtos/delete-user.dto';

@Controller('users')
export class UsersController {
  @Inject(CreateUserUseCase)
  private readonly createUserUseCase: CreateUserUseCase;

  @Inject(GetAllUsersUseCase)
  private readonly getAllUsersUseCase: GetAllUsersUseCase;

  @Inject(DeleteUserUseCase)
  private readonly deleteUserUseCase: DeleteUserUseCase;

  @Post('')
  async createUser(@Body() input: CreateUserDto): Promise<CreateUserPresenter> {
    const user = await this.createUserUseCase.execute(input);
    return CreateUserPresenter.toResponse(user);
  }

  @Get('')
  async getUsers(): Promise<UsersPresenter> {
    const allUsers: any = await this.getAllUsersUseCase.execute();
    return UsersPresenter.toResponse(allUsers);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param() input: DeleteUserDto): Promise<void> {
    await this.deleteUserUseCase.execute(input);
  }
}
