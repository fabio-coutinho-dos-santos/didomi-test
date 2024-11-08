import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetAllUsersUseCase {
  @Inject('IUsersRepository')
  private readonly userRepository: any;

  async execute(): Promise<any> {
    const allUsers = await this.userRepository.findWithRelations({
      relations: {
        events: true,
      },
    });
    return allUsers;
  }
}
