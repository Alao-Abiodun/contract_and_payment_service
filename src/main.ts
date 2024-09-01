import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as enviromentConfig } from 'src/shared/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ExceptionsFilter } from './shared/utils/ExceptionsFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: false,
      forbidUnknownValues: false,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: false,
      validationError: { value: true },
      transform: true,
      exceptionFactory: (errors) => {
        throw new UnprocessableEntityException({
          message: 'invlalid data provided',
          errors: errors
            .map(({ property, constraints }) => {
              const response: object = {};
              response[property] = Object.values(constraints);
              return response;
            })
            .reduce((acc, val) => ({ ...acc, ...val }), {}),
        });
      },
    }),
  );
  app.useGlobalFilters(new ExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Payment Service')
    .setDescription('The Payment Service API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('payment')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
    await app.listen(enviromentConfig.port.http);
}
bootstrap();
