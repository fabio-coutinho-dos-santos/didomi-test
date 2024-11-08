import { User } from './user.entity';

describe('User Domain Entity Unit Test', () => {
  it('should create a user with a valid email', () => {
    const email = 'valid@gmail.com';
    const user = new User(email);
    expect(user.email).toEqual(email);
  });
  it('should return error with empty email', () => {
    expect(() => new User('')).toThrow('Email is required');
  });
  it('should return error with invalid email format', () => {
    expect(() => new User('fasetr@gmail')).toThrow('Invalid email format');
  });
});
