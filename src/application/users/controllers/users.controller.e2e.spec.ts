import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import * as request from 'supertest';
import { DatabaseService } from '../../../infrastructure/database/postgres/database.service';
import { Repository } from 'typeorm';
import { UsersSchema } from '../../../infrastructure/database/postgres/typeorm/schemas/users.schema';
jest.setTimeout(30000);

describe('UsersController Routes', () => {
  let app;
  let httpServer;
  let repository: Repository<UsersSchema>;
  const validEmail = 'valid@gmail.com';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [DatabaseService],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    httpServer = app.getHttpServer();

    const databaseService = moduleRef.get<DatabaseService>(DatabaseService);
    const connection = databaseService.getDbHandle();

    repository = connection.getRepository(UsersSchema);
    await repository.delete({});
  });

  afterEach(async () => {
    await repository.delete({});
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

    describe('with valid email format', () => {
      it('should return 201', async () => {
        await request(httpServer)
          .post('/users')
          .send({ email: validEmail })
          .expect(HttpStatus.CREATED);
      });
    });

    describe('with email that already exists', () => {
      it('should return 422', async () => {
        await repository.save({ email: validEmail });
        await request(httpServer)
          .post('/users')
          .send({ email: validEmail })
          .expect(HttpStatus.UNPROCESSABLE_ENTITY);
      });
    });
  });

  describe('GET /users', () => {
    it('should return 200', async () => {
      await repository.save({ email: validEmail });
      const users = await request(httpServer)
        .get('/users')
        .expect(HttpStatus.OK);
      expect(users.body.length).toBe(1);
      expect(users.body[0].email).toBe(validEmail);
      expect(users.body[0].id).toBeDefined();
      expect(users.body[0].consents).toBeDefined();
      expect(users.body[0].consents).toBeInstanceOf(Array);
    });
  });

  describe('DELETE /users/{id}', () => {
    describe('with user id that exists', () => {
      it('should return 204', async () => {
        const user = await repository.save({ email: validEmail });
        const userId = user.id;

        await request(httpServer)
          .delete(`/users/${userId}`)
          .expect(HttpStatus.NO_CONTENT);
      });
    });

    describe('with user id that does not exists', () => {
      it('should return 422', async () => {
        const uuid = '61951236-b446-426f-8ecd-4284ea3c0775';

        await request(httpServer)
          .delete(`/users/${uuid}`)
          .expect(HttpStatus.UNPROCESSABLE_ENTITY);
      });
    });
  });

  describe('GET /users/{id}', () => {
    describe('with user id that exists', () => {
      it('should return 200', async () => {
        const user = await repository.save({ email: validEmail });
        const userId = user.id;

        await request(httpServer).get(`/users/${userId}`).expect(HttpStatus.OK);
      });
    });

    describe('with user id that does not exists', () => {
      it('should return 422', async () => {
        const uuid = '61951236-b446-426f-8ecd-4284ea3c0775';

        await request(httpServer)
          .delete(`/users/${uuid}`)
          .expect(HttpStatus.UNPROCESSABLE_ENTITY);
      });
    });
  });
});
