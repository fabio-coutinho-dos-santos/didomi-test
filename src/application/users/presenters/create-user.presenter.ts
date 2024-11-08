import { User } from '../../../@domain/users/entities/user.entity';

export class CreateUserPresenter {
  static toResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      consents: [],
    };
  }
}
