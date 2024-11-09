import { Test, TestingModule } from '@nestjs/testing';
import { UnprocessableEntityException } from '@nestjs/common';
import { DeleteUserUseCase } from '../delete-user.usecase';
import { DeleteUserDto } from 'src/application/users/dtos/delete-user.dto';
import { User } from '../../entities/user.entity';

const mockUsersRepository = {
  findByField: jest.fn(),
  delete: jest.fn(),
};

const input: DeleteUserDto = { id: '5cd69ebe-f7ff-4861-9a05-699414f0f403' };
const userStub = new User('valid@gmail.com');

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: 'IUsersRepository',
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(DeleteUserUseCase).toBeDefined();
  });

  describe('execute', () => {
    describe('when there are no users', () => {
      it('should throw an error', async () => {
        mockUsersRepository.findByField.mockResolvedValue(null);

        await expect(deleteUserUseCase.execute(input)).rejects.toThrow(
          UnprocessableEntityException,
        );
      });
    });

    describe('when has users', () => {
      it('should return void', async () => {
        mockUsersRepository.findByField.mockResolvedValue(userStub);
        await expect(deleteUserUseCase.execute(input)).resolves.not.toThrow();
      });
    });
  });
});
