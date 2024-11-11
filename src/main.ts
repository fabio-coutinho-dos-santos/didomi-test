import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as yaml from 'yaml';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const swaggerFilePath = './docs/api.yaml';

  const swaggerDocument = yaml.parse(fs.readFileSync(swaggerFilePath, 'utf8'));

  const apiVersion = configService.get<string>('API_VERSION') || 'v1';
  const apiPrefix = `api/${apiVersion}`;

  app.use(
    `/${apiPrefix}/doc`,
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument),
  );

  app.setGlobalPrefix(apiPrefix);
  console.log('DATABASE', process.env.DB_URL_TEST_CONNECTION);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
