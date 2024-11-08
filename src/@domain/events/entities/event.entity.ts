import { EventsNames } from '../enums/events.enums';

export class Event {
  constructor(
    private _userId: string,
    private _name: EventsNames,
  ) {}
}
