import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Event } from '../../../../../@domain/events/entities/event.entity';
import { EventsHistorySchema } from '../schemas/events-history.schema';
import { IEventsHistoryRepository } from 'src/@domain/events/repositories/events-history.repository.interface';

export class EventsHistoryRepository
  extends BaseRepository<Event>
  implements IEventsHistoryRepository
{
  constructor(
    @InjectRepository(EventsHistorySchema)
    private readonly eventsRepository: Repository<Event>,
  ) {
    super(eventsRepository);
  }
}
