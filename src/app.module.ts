import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/postgres/database.module';
import { UsersModule } from './application/users/modules/users.module';
import { EventsModule } from './application/events/modules/events.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule, EventsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
