import { EventsNames } from '../enums/events.enums';

export class Event {
  private _id?: string;
  constructor(
    private _user_id: string,
    private _name: EventsNames,
    private _enabled: boolean,
  ) {
    this.validate();
  }

  private validate() {
    const uuidv4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!this._user_id) {
      throw new Error('User ID is required');
    }
    if (!uuidv4Regex.test(this._user_id)) {
      throw new Error('Invalid user ID format');
    }
    if (!this._name) {
      throw new Error('Event name is required');
    }
    if (!Object.values(EventsNames).includes(this._name)) {
      throw new Error('Invalid event name');
    }
    if (this._enabled === undefined) {
      throw new Error('Event enabled is required');
    }
  }

  get user_id(): string {
    return this._user_id;
  }

  get name(): EventsNames {
    return this._name;
  }

  set user_id(userId: string) {
    this._user_id = userId;
  }

  set name(name: EventsNames) {
    this._name = name;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(enabled: boolean) {
    this._enabled = enabled;
  }

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }
}
