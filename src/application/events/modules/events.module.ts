import { Module } from '@nestjs/common';
import { EventsController } from '../controllers/events.controller';
import { EventsRepository } from '../../../infrastructure/database/postgres/typeorm/repositories/events.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsSchema } from '../../../infrastructure/database/postgres/typeorm/schemas/events.schema';
import { UsersModule } from '../../../application/users/modules/users.module';
import { CreateEventUseCase } from '../../../@domain/events/use-cases/create-event.usecase';
import { EventsHistoryRepository } from '../../../infrastructure/database/postgres/typeorm/repositories/events-history.repository';
import { EventsHistorySchema } from '../../../infrastructure/database/postgres/typeorm/schemas/events-history.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventsSchema, EventsHistorySchema]),
    UsersModule,
  ],
  controllers: [EventsController],
  providers: [
    CreateEventUseCase,
    {
      provide: 'IEventsRepository',
      useClass: EventsRepository,
    },
    {
      provide: 'IEventsHistoryRepository',
      useClass: EventsHistoryRepository,
    },
  ],
  exports: [],
})
export class EventsModule {}
