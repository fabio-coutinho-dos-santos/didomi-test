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

export class UsersPresenter {
  static toResponse(user: User[]) {
    return user.map((user) => {
      return {
        id: user.id,
        email: user.email,
        consents: user.events.map((event) => {
          return {
            id: event.name,
            enabled: event.enabled,
          };
        }),
      };
    });
  }
}
