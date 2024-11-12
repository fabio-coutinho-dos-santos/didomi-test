import { Module } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'dotenv/config';

// Used for send logs to Datadog
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const httpTransport = new winston.transports.Http({
  level: 'info',
  format: winston.format.json(),
  host: 'http-intake.logs.datadoghq.com',
  path: `/v1/input/${process.env.DD_API_KEY}`,
  ssl: true,
});

// Used for logging to a file
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fileTransport = new winston.transports.File({
  filename: 'application.log',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});

const consoleJsonTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [consoleJsonTransport],
    }),
  ],
  exports: [WinstonModule],
  providers: [
    {
      provide: 'LoggerService',
      useExisting: WINSTON_MODULE_NEST_PROVIDER,
    },
  ],
})
export class WinstonLoggerModule {}
