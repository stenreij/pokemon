import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApiResponseInterceptor } from '@pokemon/backend/dto';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const corsOptions: CorsOptions = {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  };

  app.enableCors(corsOptions)
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true,  transformOptions: { enableImplicitConversion: true } } ));
  app.useGlobalInterceptors(new ApiResponseInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application data-api is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();