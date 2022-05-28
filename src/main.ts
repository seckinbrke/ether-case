import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as pkg from '../package.json';

const mapConfigLogLevelToNest = (level: string) => {
  switch (level) {
    case 'emerg':
    case 'alert':
    case 'crit':
      return 'error';
    case 'warning':
      return 'warn';
    case 'notice':
    case 'info':
      return 'log';
    default:
      return level;
  }
};

const getLogLevels = (configService: ConfigService): LogLevel[] | null => {
  const logLevels = ['error', 'warn', 'log', 'verbose', 'debug'];

  const configLogLevel = configService.get('log.level');
  const nestLogLevel = mapConfigLogLevelToNest(configLogLevel);

  const maxLogLevelIndex = logLevels.indexOf(nestLogLevel);

  return maxLogLevelIndex !== -1
    ? logLevels.slice(0, maxLogLevelIndex + 1) as LogLevel[]
    : null;
};

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const logLevels = getLogLevels(configService);

  if (logLevels) {
    app.useLogger(logLevels);
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const config = new DocumentBuilder()
    .setTitle(pkg.name)
    .setDescription(pkg.description)
    .setVersion(pkg.version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.listen(8080);
};

bootstrap();
