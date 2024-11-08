import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';
import { UsersRepository } from '../../../infrastructure/database/postgres/typeorm/repositories/users.repository';
import { UsersSchema } from '../../../infrastructure/database/postgres/typeorm/schemas/users.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserUseCase } from 'src/@domain/users/use-cases/create-user.usecase';
import { GetAllUsersUseCase } from 'src/@domain/users/use-cases/get-all-users.usecase';
import { DeleteUserUseCase } from 'src/@domain/users/use-cases/delete-user.usecase';

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
  ],
  exports: [
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
  ],
})
export class UsersModule {}
