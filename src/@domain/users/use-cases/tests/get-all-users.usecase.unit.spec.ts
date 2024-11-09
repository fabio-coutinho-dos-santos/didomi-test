import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../entities/user.entity';
import { GetAllUsersUseCase } from '../get-all-users.usecase';

const mockUsersRepository = {
  findWithRelations: jest.fn(),
};

const user = new User('valid@gmail.com');

describe('GetAllUsersUseCase', () => {
  let getAllUsersUseCase: GetAllUsersUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllUsersUseCase,
        {
          provide: 'IUsersRepository',
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    getAllUsersUseCase = module.get<GetAllUsersUseCase>(GetAllUsersUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(getAllUsersUseCase).toBeDefined();
  });

  describe('execute', () => {
    describe('when users already exists', () => {
      it('should throw an users array', async () => {
        mockUsersRepository.findWithRelations.mockResolvedValue([user]);
        const allUsers = await getAllUsersUseCase.execute();
        expect(allUsers).toEqual([user]);
      });
    });
  });
});
