import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as yaml from 'yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const swaggerFilePath = './docs/api.yaml';

  const swaggerDocument = yaml.parse(fs.readFileSync(swaggerFilePath, 'utf8'));

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
