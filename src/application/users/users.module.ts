import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersRepository } from '../../infrastructure/database/postgres/typeorm/repositories/users.repository';
import { UsersSchema } from '../../infrastructure/database/postgres/typeorm/schemas/users.schema';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UsersSchema])],
  controllers: [UsersController],
  providers: [
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
  ],
  exports: [],
})
export class UsersModule {}
