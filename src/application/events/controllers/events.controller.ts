import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateEventDto } from '../dtos/create-event.dto';
import { CreateEventUseCase } from 'src/@domain/events/use-cases/create-event.usecase';

@Controller('events')
export class EventsController {
  @Inject(CreateEventUseCase)
  private readonly createEventUseCase: CreateEventUseCase;

  @Post('')
  // @UseFilters(ExceptionsFilter)
  async createEvent(@Body() input: CreateEventDto): Promise<any> {
    await this.createEventUseCase.execute(input);
  }
}
