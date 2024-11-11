import {
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { User } from '../entities/user.entity';
import { GetUserByIdDto } from 'src/application/users/dtos/get-user-by-id.dto';

@Injectable()
export class GetUserByIdUseCase {
  @Inject('IUsersRepository')
  private readonly usersRepository: IUsersRepository;

  async execute(input: GetUserByIdDto): Promise<User> {
    const { id } = input;
    const user = await this.usersRepository.findOneWithRelations({
      where: { id: id },
      relations: {
        events: true,
      },
    });
    if (!user) {
      Logger.error('User not found', GetUserByIdUseCase.name);
      throw new UnprocessableEntityException('User not found');
    }
    return user;
  }
}
