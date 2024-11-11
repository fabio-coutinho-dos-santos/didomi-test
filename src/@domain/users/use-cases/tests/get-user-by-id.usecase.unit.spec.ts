import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../entities/user.entity';
import { GetUserByIdUseCase } from '../get-user-by-id.usecase';
import { GetUserByIdDto } from 'src/application/users/dtos/get-user-by-id.dto';
import { UnprocessableEntityException } from '@nestjs/common';

const mockUsersRepository = {
  findOneWithRelations: jest.fn(),
};

const uuid = '5cd69ebe-f7ff-4861-9a05-699414f0f403';

const getUserByIdDto: GetUserByIdDto = {
  id: uuid,
};

describe('GetUserById', () => {
  let getUserByIdUseCase: GetUserByIdUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserByIdUseCase,
        {
          provide: 'IUsersRepository',
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    getUserByIdUseCase = module.get<GetUserByIdUseCase>(GetUserByIdUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(GetUserByIdUseCase).toBeDefined();
  });

  describe('execute', () => {
    describe('when users already exists', () => {
      it('should return a user', async () => {
        const user = new User('valid@gmail.com');
        mockUsersRepository.findOneWithRelations.mockResolvedValue(user);
        const userStored = await getUserByIdUseCase.execute(getUserByIdDto);
        expect(user).toEqual(userStored);
      });
    });

    describe('when users does not exists', () => {
      it('should return an exception', async () => {
        mockUsersRepository.findOneWithRelations.mockResolvedValue(null);
        await expect(
          getUserByIdUseCase.execute(getUserByIdDto),
        ).rejects.toThrow(UnprocessableEntityException);
      });
    });
  });
});
