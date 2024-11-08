import { Module } from '@nestjs/common';
import { EventsController } from '../controllers/events.controller';
import { EventsRepository } from '../../../infrastructure/database/postgres/typeorm/repositories/events.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsSchema } from 'src/infrastructure/database/postgres/typeorm/schemas/events.schema';
import { UsersModule } from 'src/application/users/modules/users.module';
import { CreateEventUseCase } from 'src/@domain/events/use-cases/create-event.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([EventsSchema]), UsersModule],
  controllers: [EventsController],
  providers: [
    CreateEventUseCase,
    {
      provide: 'IEventsRepository',
      useClass: EventsRepository,
    },
  ],
  exports: [],
})
export class EventsModule {}
