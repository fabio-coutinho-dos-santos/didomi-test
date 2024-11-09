import { Test, TestingModule } from '@nestjs/testing';
import { UnprocessableEntityException } from '@nestjs/common';
import { CreateEventUseCase } from './create-event.usecase';
import { IUsersRepository } from '../../../@domain/users/repositories/users.repository.interface';
import { IEventsRepository } from '../repositories/events.repository.interface';
import { IEventsHistoryRepository } from '../repositories/events-history.repository.interface';
import { CreateEventDto } from '../../../application/events/dtos/create-event.dto';
import { EventsNames } from '../enums/events.enums';
import { User } from '../../../@domain/users/entities/user.entity';
import { Event } from '../entities/event.entity';

const mockUsersRepository = {
  findByField: jest.fn(),
};

const mockEventsRepository = {
  createOrUpdate: jest.fn(),
};

const mockEventsHistoryRepository = {
  create: jest.fn(),
};

const input: CreateEventDto = {
  user: { id: '5cd69ebe-f7ff-4861-9a05-699414f0f403' },
  consents: [
    {
      id: EventsNames.EMAIL,
      enabled: true,
    },
  ],
};

const eventStub = new Event(
  input.user.id,
  input.consents[0].id as EventsNames,
  input.consents[0].enabled,
);

const user = new User('email@gmail.com');

describe('CreateEventUseCase', () => {
  let createEventUseCase: CreateEventUseCase;
  let usersRepository: IUsersRepository;
  let eventsRepository: IEventsRepository;
  let eventsHistoryRepository: IEventsHistoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEventUseCase,
        {
          provide: 'IUsersRepository',
          useValue: mockUsersRepository,
        },
        {
          provide: 'IEventsRepository',
          useValue: mockEventsRepository,
        },
        {
          provide: 'IEventsHistoryRepository',
          useValue: mockEventsHistoryRepository,
        },
      ],
    }).compile();

    createEventUseCase = module.get<CreateEventUseCase>(CreateEventUseCase);
    usersRepository = module.get<IUsersRepository>('IUsersRepository');
    eventsRepository = module.get<IEventsRepository>('IEventsRepository');
    eventsHistoryRepository = module.get<IEventsHistoryRepository>(
      'IEventsHistoryRepository',
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(createEventUseCase).toBeDefined();
  });

  describe('execute', () => {
    describe('when there are no users', () => {
      it('should throw an error', async () => {
        mockUsersRepository.findByField.mockResolvedValue(null);

        await expect(createEventUseCase.execute(input)).rejects.toThrow(
          UnprocessableEntityException,
        );
      });
    });

    describe('when user no exists', () => {
      it('should return a new user', async () => {
        mockUsersRepository.findByField.mockResolvedValue(user);
        mockEventsRepository.createOrUpdate.mockResolvedValue(eventStub);
        mockEventsHistoryRepository.create.mockResolvedValue(eventStub);
        const spyStoreEventsHistory = jest.spyOn(
          createEventUseCase,
          'storeEventsHistory',
        );

        const spyStoreEvents = jest.spyOn(createEventUseCase, 'storeEvents');

        await createEventUseCase.execute(input);

        expect(spyStoreEventsHistory).toHaveBeenCalledTimes(1);
        expect(spyStoreEvents).toHaveBeenCalledTimes(1);

        await expect(createEventUseCase.execute(input)).resolves.not.toThrow();
      });
    });
  });
});