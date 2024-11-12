import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class GetAllUsersUseCase {
  @Inject('IUsersRepository')
  private readonly userRepository: any;

  async execute(): Promise<User[]> {
    try {
      return await this.userRepository.findWithRelations({
        relations: {
          events: true,
        },
      });
    } catch (error) {
      Logger.error(`Error getting all users: ${error.message}`);
      throw error;
    }
  }
}
