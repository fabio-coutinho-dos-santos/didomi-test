import { HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { EventsNames } from '../../@domain/events/enums/events.enums';

describe('EventsController Routes', () => {
  let app;
  let httpServer;

  const uuid = '61951236-b446-426f-8ecd-4284ea3c0775';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    httpServer = app.getHttpServer();
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

    describe('with valid input format', () => {
      it('should return 201', async () => {
        await request(httpServer)
          .post('/events')
          .send({ name: EventsNames.EMAIL, userId: uuid })
          .expect(HttpStatus.CREATED);

        await request(httpServer)
          .post('/events')
          .send({ name: EventsNames.SMS, userId: uuid })
          .expect(HttpStatus.CREATED);
      });
    });
  });
});
