/* eslint-disable class-methods-use-this */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { configuration } from './config';
import { ENVIRONMENTS } from './constants';

@Module({
  imports: [
    ApiModule,
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ENVIRONMENTS[process.env.NODE_ENV] || ENVIRONMENTS.development,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*');
  }
}
