import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { DeleteUserDto } from 'src/application/users/dtos/delete-user.dto';

@Injectable()
export class DeleteUserUseCase {
  @Inject('IUsersRepository')
  private readonly userRepository: IUsersRepository;

  async execute(input: DeleteUserDto): Promise<void> {
    const { id } = input;

    const userStored = await this.userRepository.findByField('id', id);
    if (!userStored) {
      throw new UnprocessableEntityException('User not found');
    }

    await this.userRepository.delete(id);
  }
}
