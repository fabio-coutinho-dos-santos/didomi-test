import { EventsNames } from '../enums/events.enums';

export class Event {
  private uuidv4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  constructor(
    private _userId: string,
    private _name: EventsNames,
  ) {
    this.validate();
  }

  private validate() {
    if (!this._userId) {
      throw new Error('User ID is required');
    }
    if (!this.uuidv4Regex.test(this._userId)) {
      throw new Error('Invalid user ID format');
    }
    if (!this._name) {
      throw new Error('Event name is required');
    }
    if (!Object.values(EventsNames).includes(this._name)) {
      throw new Error('Invalid event name');
    }
  }

  get userId(): string {
    return this._userId;
  }

  get name(): EventsNames {
    return this._name;
  }

  set userId(userId: string) {
    this._userId = userId;
  }

  set name(name: EventsNames) {
    this._name = name;
  }
}
