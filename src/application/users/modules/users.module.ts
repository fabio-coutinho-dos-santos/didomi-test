import { Get, Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';
import { UsersRepository } from '../../../infrastructure/database/postgres/typeorm/repositories/users.repository';
import { UsersSchema } from '../../../infrastructure/database/postgres/typeorm/schemas/users.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserUseCase } from '../../../@domain/users/use-cases/create-user.usecase';
import { GetAllUsersUseCase } from '../../../@domain/users/use-cases/get-all-users.usecase';
import { DeleteUserUseCase } from '../../../@domain/users/use-cases/delete-user.usecase';
import { GetUserByIdUseCase } from '../../../@domain/users/use-cases/get-user-by-id.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UsersSchema])],
  controllers: [UsersController],
  providers: [
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
    CreateUserUseCase,
    GetAllUsersUseCase,
    DeleteUserUseCase,
    GetUserByIdUseCase,
  ],
  exports: [
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
  ],
})
export class UsersModule {}
