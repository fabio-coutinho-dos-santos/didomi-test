import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class GetAllUsersUseCase {
  @Inject('IUsersRepository')
  private readonly userRepository: any;

  async execute(): Promise<User[]> {
    const allUsers = await this.userRepository.findWithRelations({
      relations: {
        events: true,
      },
    });
    return allUsers;
  }
}
