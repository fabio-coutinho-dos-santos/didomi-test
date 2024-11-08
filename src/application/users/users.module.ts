import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from '../../infrastructure/database/postgres/typeorm/repositories/users.repository';
import { UsersSchema } from '../../infrastructure/database/postgres/typeorm/schemas/users.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserUseCase } from 'src/@domain/users/use-cases/create-user.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UsersSchema])],
  controllers: [UsersController],
  providers: [
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
    CreateUserUseCase,
  ],
  exports: [],
})
export class UsersModule {}
