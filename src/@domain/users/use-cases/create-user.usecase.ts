import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { User } from '../entities/user.entity';
import { CreateUserPresenter } from '../../../application/users/presenters/create-user.presenter';
import { CreateUserDto } from '../../../application/users/dtos/users.dto';

@Injectable()
export class CreateUserUseCase {
  @Inject('IUsersRepository')
  private readonly userRepository: IUsersRepository;

  async execute(input: CreateUserDto): Promise<CreateUserPresenter> {
    const { email } = input;

    const oldUser = await this.userRepository.findByField('email', email);

    if (oldUser) {
      throw new UnprocessableEntityException('User already exists');
    }

    const userEntity = new User(email);
    const user = await this.userRepository.create(userEntity);
    return CreateUserPresenter.toResponse(user);
  }
}
