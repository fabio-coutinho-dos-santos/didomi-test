import { Inject, Injectable, Logger } from '@nestjs/common';
import { IEventsRepository } from '../repositories/events.repository.interface';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEventsNames } from '../enums/events.enums';
import { EventCreated } from './event-created-event';

@Injectable()
export class EventsHandlerService {
  @Inject('IEventsRepository')
  private readonly eventsRepository: IEventsRepository;

  @OnEvent(DomainEventsNames.EVENT_CREATED)
  async handleUserCreatedEvent(event: EventCreated) {
    try {
      Logger.log('Event created received');
      await this.eventsRepository.createOrUpdate(event.event);
      Logger.log(
        `Event ${event.event.name} stored for user ${event.event.user_id}`,
        EventsHandlerService.name,
      );
    } catch (error) {
      Logger.error(
        'Error on store or update event',
        error,
        EventsHandlerService.name,
      );
    }
  }
}
