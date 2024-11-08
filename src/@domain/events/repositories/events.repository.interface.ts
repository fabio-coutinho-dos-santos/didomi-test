import { IRespository } from 'src/@domain/@shared/repository.interface';
import { Event } from '../entities/event.entity';

export interface IEventsRepository extends IRespository<Event> {}
