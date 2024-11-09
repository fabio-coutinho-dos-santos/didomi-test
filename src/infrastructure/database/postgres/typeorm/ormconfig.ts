import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UsersSchema } from './schemas/users.schema';
import { EventsSchema } from './schemas/events.schema';
import { EventsHistorySchema } from './schemas/events-history.schema';

const configService = new ConfigService();

export function ormConfig(): any {
  const NODE_ENV = process.env.NODE_ENV;

  if (NODE_ENV === 'test') {
    return {
      type: 'postgres',
      url: configService.get<string>('DB_TEST_URL_CONNECTION'),
      synchronize: true,
      logging: false,
      entities: [UsersSchema, EventsSchema, EventsHistorySchema],
      migrations: ['dist/migrations/*.js'],
      timezone: 'Z',
    };
  } else {
    return {
      type: 'postgres',
      url: configService.get<string>('DB_URL_CONNECTION'),
      synchronize: false,
      logging: false,
      entities: [UsersSchema, EventsSchema, EventsHistorySchema],
      migrations: ['dist/migrations/*.js'],
      timezone: 'Z',
    };
  }
}

const datasource = new DataSource(ormConfig());
export default datasource;
