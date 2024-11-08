import { User } from '../entities/user.entity';

export class UserPresenter {
  static toResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      events: user.events ?? [],
    };
  }
}
