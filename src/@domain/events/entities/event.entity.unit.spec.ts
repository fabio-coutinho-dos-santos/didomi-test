import { EventsNames } from '../enums/events.enums';
import { Event } from './event.entity';

const uuid = '61951236-b446-426f-8ecd-4284ea3c0775';

describe('Event Domain Entity Unit Test', () => {
  it('should create an event with a valid name', () => {
    const name = EventsNames.EMAIL;
    const event = new Event(uuid, name, true);

    expect(event.user_id).toEqual(uuid);
    expect(event.name).toEqual(name);
    expect(event.enabled).toBeTruthy();
  });
  it('should return error with empty userId', () => {
    expect(() => new Event('', EventsNames.EMAIL, true)).toThrow(
      'User ID is required',
    );
  });
  it('should return error with empty name', () => {
    expect(() => new Event(uuid, '' as EventsNames, false)).toThrow(
      'Event name is required',
    );
  });
  it('should return error with invalid name format', () => {
    expect(() => new Event(uuid, 'invalid' as EventsNames, true)).toThrow(
      'Invalid event name',
    );
  });
});
