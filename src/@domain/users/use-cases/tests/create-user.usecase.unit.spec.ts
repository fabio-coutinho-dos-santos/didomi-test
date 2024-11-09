import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '../create-user.usecase';
import { CreateUserDto } from 'src/application/users/dtos/users.dto';
import { User } from '../../entities/user.entity';
import { UnprocessableEntityException } from '@nestjs/common';

const mockUsersRepository = {
  findByField: jest.fn(),
  create: jest.fn(),
};

const input: CreateUserDto = { email: 'valid@gmail.com' };
const user = new User(input.email);

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: 'IUsersRepository',
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(createUserUseCase).toBeDefined();
  });

  describe('execute', () => {
    describe('when user already exists', () => {
      it('should throw an error', async () => {
        mockUsersRepository.findByField.mockResolvedValue(user);
        mockUsersRepository.create.mockResolvedValue(null);

        await expect(createUserUseCase.execute(input)).rejects.toThrow(
          UnprocessableEntityException,
        );
      });
    });

    describe('when user no exists', () => {
      it('should return a new user', async () => {
        mockUsersRepository.findByField.mockResolvedValue(null);
        mockUsersRepository.create.mockResolvedValue(user);
        const newUser = await createUserUseCase.execute(input);
        expect(newUser).toEqual(user);
      });
    });
  });
});
