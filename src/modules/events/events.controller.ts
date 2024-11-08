import { Body, Controller, Post } from '@nestjs/common';
import { CreateEventDto } from '../../@core/domain/events/create-event.dto';

@Controller('events')
export class EventsController {
  @Post('')
  async createEvent(@Body() input: CreateEventDto): Promise<any> {
    return 'Event created';
  }
}
