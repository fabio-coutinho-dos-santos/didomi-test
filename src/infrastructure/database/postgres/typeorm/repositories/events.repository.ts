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
}
