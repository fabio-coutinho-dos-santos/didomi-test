import {
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { CreateUserDto } from '../dtos/users.dto';
import { User } from '../entities/user.entity';
import { UserPresenter } from '../presenters/create-user.presenter';

@Injectable()
export class CreateUserUseCase {
  @Inject('IUsersRepository')
  private readonly userRepository: IUsersRepository;

  async execute(input: CreateUserDto): Promise<UserPresenter> {
    const { email } = input;

    const oldUser = await this.userRepository.findByField('email', email);

    if (oldUser) {
      throw new UnprocessableEntityException('User already exists');
    }

    const userEntity = new User(email);
    const user = await this.userRepository.create(userEntity);
    return UserPresenter.toResponse(user);
  }
}
