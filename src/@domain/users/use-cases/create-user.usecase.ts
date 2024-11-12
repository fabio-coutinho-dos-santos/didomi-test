import {
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../../../application/users/dtos/users.dto';

@Injectable()
export class CreateUserUseCase {
  @Inject('IUsersRepository')
  private readonly userRepository: IUsersRepository;

  async execute(input: CreateUserDto): Promise<User> {
    try {
      const { email } = input;

      const oldUser = await this.userRepository.findByField('email', email);

      if (oldUser) {
        throw new UnprocessableEntityException('User already exists');
      }

      const userEntity = new User(email);
      return await this.userRepository.create(userEntity);
    } catch (error) {
      Logger.error(
        `Error creating user with email ${input.email}: ${error.message}`,
      );
      throw error;
    }
  }
}
