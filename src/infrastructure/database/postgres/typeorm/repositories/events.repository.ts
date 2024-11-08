import { InjectRepository } from '@nestjs/typeorm';
import { IRespository } from 'src/@domain/@shared/repository.interface';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { EventsSchema } from '../schemas/events.schema';
import { IEventsRepository } from 'src/@domain/events/repositories/events.repository.interface';

export class UsersRepository
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
