import {
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ConsentDto,
  CreateEventDto,
} from 'src/application/events/dtos/create-event.dto';
import { IUsersRepository } from 'src/@domain/users/repositories/users.repository.interface';
import { Event } from '../entities/event.entity';
import { DomainEventsNames, EventsNames } from '../enums/events.enums';
import { IEventsHistoryRepository } from '../repositories/events-history.repository.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventCreated } from '../domain-events/event-created-event';

@Injectable()
export class CreateEventUseCase {
  @Inject('IUsersRepository')
  private readonly usersRepository: IUsersRepository;

  @Inject('IEventsHistoryRepository')
  private readonly eventsHistoryRepository: IEventsHistoryRepository;

  @Inject(EventEmitter2)
  private readonly eventEmitter: EventEmitter2;

  async execute(input: CreateEventDto): Promise<void> {
    try {
      const { user, consents } = input;

      const userStored = await this.usersRepository.findByField('id', user.id);

      if (!userStored) {
        throw new UnprocessableEntityException('User not found');
      }

      await this.storeEventsHistory(user.id, consents);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  public async storeEventsHistory(
    userId: string,
    consents: ConsentDto[],
  ): Promise<void> {
    await Promise.all(
      consents.map(async (consent) => {
        const event = new Event(
          userId,
          consent.id as EventsNames,
          consent.enabled,
        );
        await this.eventsHistoryRepository.create(event);
        await this.eventEmitter.emit(
          DomainEventsNames.EVENT_CREATED,
          new EventCreated(event),
        );
      }),
    );
  }
}
