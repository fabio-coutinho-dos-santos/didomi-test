import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './@core/infra/database/postgres/database.module';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule, EventsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
