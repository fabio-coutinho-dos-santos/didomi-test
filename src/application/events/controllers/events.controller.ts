import {
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateEventDto } from '../dtos/create-event.dto';
import { CreateEventUseCase } from '../../../@domain/events/use-cases/create-event.usecase';

@Controller('events')
export class EventsController {
  @Inject(CreateEventUseCase)
  private readonly createEventUseCase: CreateEventUseCase;

  @Post('')
  // @UseFilters(ExceptionsFilter)
  async createEvent(@Body() input: CreateEventDto): Promise<void> {
    try {
      await this.createEventUseCase.execute(input);
    } catch (error) {
      if (error instanceof UnprocessableEntityException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
