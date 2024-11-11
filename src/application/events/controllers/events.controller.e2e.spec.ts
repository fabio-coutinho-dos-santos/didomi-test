import { HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { EventsNames } from '../../../@domain/events/enums/events.enums';
import { DatabaseModule } from '../../../infrastructure/database/postgres/database.module';
import { DatabaseService } from '../../../infrastructure/database/postgres/database.service';
import { Repository } from 'typeorm';
import { EventsSchema } from '../../../infrastructure/database/postgres/typeorm/schemas/events.schema';
import { UsersSchema } from '../../../infrastructure/database/postgres/typeorm/schemas/users.schema';
import { CreateEventDto } from '../dtos/create-event.dto';
import { EventsHistorySchema } from '../../../infrastructure/database/postgres/typeorm/schemas/events-history.schema';
jest.setTimeout(30000);

describe('EventsController Routes', () => {
  let app;
  let httpServer;
  let eventRepository: Repository<EventsSchema>;
  let usersRepository: Repository<UsersSchema>;
  let eventHistoryRepository: Repository<EventsHistorySchema>;

  const uuid = '61951236-b446-426f-8ecd-4284ea3c0775';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    httpServer = app.getHttpServer();

    const databaseService = moduleRef.get(DatabaseService);
    const connection = databaseService.getDbHandle();

    eventRepository = connection.getRepository(EventsSchema);
    usersRepository = connection.getRepository(UsersSchema);
    eventHistoryRepository = connection.getRepository(EventsHistorySchema);

    await eventRepository.delete({});
    await usersRepository.delete({});
    await eventHistoryRepository.delete({});
  });

  afterEach(async () => {
    await eventRepository.delete({});
    await usersRepository.delete({});
    await eventHistoryRepository.delete({});
  });

  describe('POST /events', () => {
    describe('with invalid event name format', () => {
      it('should return 400', async () => {
        await request(httpServer)
          .post('/events')
          .send({ name: 'invalid', userId: uuid })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe('with invalid user id format', () => {
      it('should return 400', async () => {
        await request(httpServer)
          .post('/events')
          .send({ name: EventsNames.EMAIL, userId: '1' })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe('with invalid user id', () => {
      it('should return 422', async () => {
        const uuid = '61951236-b446-426f-8ecd-4284ea3c0775';
        const createEventBody: CreateEventDto = {
          user: {
            id: uuid,
          },
          consents: [
            {
              id: EventsNames.EMAIL,
              enabled: true,
            },
          ],
        };
        await request(httpServer)
          .post('/events')
          .send(createEventBody)
          .expect(HttpStatus.UNPROCESSABLE_ENTITY);
      });
    });

    describe('with valid input format', () => {
      it('should return 201', async () => {
        const user = await usersRepository.save({ email: 'valid@gmail.com' });
        const userId = user.id;

        const createEventBody: CreateEventDto = {
          user: {
            id: userId,
          },
          consents: [
            {
              id: EventsNames.EMAIL,
              enabled: true,
            },
          ],
        };

        await request(httpServer)
          .post('/events')
          .send(createEventBody)
          .expect(HttpStatus.CREATED);
      });
    });

    describe('with valid input format', () => {
      it('should return 201 and must be save the event in events_history table', async () => {
        const user = await usersRepository.save({
          email: 'valid.email@gmail.com',
        });
        const userId = user.id;

        const createEventBody: CreateEventDto = {
          user: {
            id: userId,
          },
          consents: [
            {
              id: EventsNames.EMAIL,
              enabled: true,
            },
          ],
        };

        await request(httpServer)
          .post('/events')
          .send(createEventBody)
          .expect(HttpStatus.CREATED);

        const eventsStored = await eventHistoryRepository.find();
        expect(eventsStored.length).toBe(1);
        expect(eventsStored[0].user_id).toBe(userId);
        expect(eventsStored[0].name).toBe(EventsNames.EMAIL);
        expect(eventsStored[0].enabled).toBe(true);
      });
    });
  });
});
