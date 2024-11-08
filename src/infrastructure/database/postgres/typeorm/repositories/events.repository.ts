import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { EventsSchema } from '../schemas/events.schema';
import { IEventsRepository } from 'src/@domain/events/repositories/events.repository.interface';
import { Event } from '../../../../../@domain/events/entities/event.entity';

export class EventsRepository
  extends BaseRepository<Event>
  implements IEventsRepository
{
  constructor(
    @InjectRepository(EventsSchema)
    private readonly eventsRepository: Repository<Event>,
  ) {
    super(eventsRepository);
  }

  async createOrUpdate(event: Event): Promise<Event> {
    const eventStored = await this.eventsRepository.findOne({
      where: {
        user_id: event.user_id,
        name: event.name,
      },
    });
    if (eventStored) {
      await this.eventsRepository.update(eventStored.id, {
        enabled: event.enabled,
      });
      return await this.eventsRepository.findOne({
        where: { id: eventStored.id },
      });
    } else {
      return await this.eventsRepository.save(event);
    }
  }
}
