import { IRespository } from 'src/@domain/@shared/repository.interface';
import { User } from '../entities/user.entity';

export interface IUsersRepository extends IRespository<User> {}
