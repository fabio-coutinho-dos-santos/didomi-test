import { InjectRepository } from '@nestjs/typeorm';
import { IRespository } from 'src/@domain/@shared/repository.interface';
import { User } from 'src/@domain/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersSchema } from '../schemas/users.schema';
import { BaseRepository } from './base.repository';
import { IUsersRepository } from 'src/@domain/users/repositories/users.repository.interface';

export class UsersRepository
  extends BaseRepository<User>
  implements IUsersRepository
{
  constructor(
    @InjectRepository(UsersSchema)
    private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }
}
