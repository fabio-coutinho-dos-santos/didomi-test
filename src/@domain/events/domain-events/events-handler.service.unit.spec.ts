import { Test, TestingModule } from '@nestjs/testing';
import { EventsHandlerService } from './events-handler.service';
import { EventCreated } from './event-created-event';
import { EventsNames } from '../enums/events.enums';
import { Event } from '../entities/event.entity';
import { Logger } from '@nestjs/common';

describe('Events Handler Service', () => {
  const mockEventsRepository = {
    createOrUpdate: jest.fn(),
  };

  const event = new Event(
    '5cd69ebe-f7ff-4861-9a05-699414f0f403',
    EventsNames.EMAIL,
    true,
  );

  let eventsHandlerService: EventsHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsHandlerService,
        {
          provide: 'IEventsRepository',
          useValue: mockEventsRepository,
        },
      ],
    }).compile();

    eventsHandlerService =
      module.get<EventsHandlerService>(EventsHandlerService);

    jest.spyOn(Logger, 'error').mockImplementation(() => {});
    jest.spyOn(Logger, 'log').mockImplementation(() => {});
  });

  describe('handlerUserCreatedEvent', () => {
    it('should call createOrUpdate method from eventsRepositor', async () => {
      mockEventsRepository.createOrUpdate.mockResolvedValue(event);
      const spy = jest.spyOn(mockEventsRepository, 'createOrUpdate');
      const eventCreatedEvent = new EventCreated(event);

      await eventsHandlerService.handleUserCreatedEvent(eventCreatedEvent);

      expect(spy).toHaveBeenCalledWith(event);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(Logger.log).toHaveBeenCalledWith(
        `Event ${event.name} stored for user ${event.user_id}`,
        EventsHandlerService.name,
      );
    });

    it('should call createOrUpdate method from eventsRepositor', async () => {
      const error = new Error('Database error');
      mockEventsRepository.createOrUpdate.mockRejectedValueOnce(error);

      await eventsHandlerService.handleUserCreatedEvent(
        new EventCreated(event),
      );

      expect(Logger.error).toHaveBeenCalledWith(
        'Error on store or update event',
        error,
        EventsHandlerService.name,
      );
    });
  });
});
