import { Event } from '../entities/event.entity';

export class EventCreated {
  constructor(private readonly _event: Event) {}

  get event(): Event {
    return this._event;
  }
}
