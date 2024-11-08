import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import * as request from 'supertest';

describe('UsersController Routes', () => {
  let app;
  let httpServer;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    httpServer = app.getHttpServer();
  });

  describe('POST /users', () => {
    describe('with invalid email format', () => {
      it('should return 400', async () => {
        await request(httpServer)
          .post('/users')
          .send({ email: 'invalid' })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('POST /users', () => {
    describe('with valid email format', () => {
      it('should return 201', async () => {
        await request(httpServer)
          .post('/users')
          .send({ email: 'valid@gmail.com' })
          .expect(HttpStatus.CREATED);
      });
    });
  });
});
