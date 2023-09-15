import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ApplicationModule } from './app.module';
import { BaseExceptionFilter } from './common/filters/BaseException.filter';

const bootstrap = async (): Promise<void> => {
  try {
    const app = await NestFactory.create<NestExpressApplication>(ApplicationModule, {
      cors: {
        origin: true,
        optionsSuccessStatus: 204,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        credentials: true,
      },
    });

    // App configuration
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    app.use(cookieParser());
    app.useGlobalFilters(new BaseExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        enableDebugMessages: true,
        forbidUnknownValues: true,
        transform: true,
        validationError: {
          target: false,
          value: true,
        },
      })
    );

    const configService = app.get<ConfigService>(ConfigService);
    const httpAdapter = app.getHttpAdapter();
    const logger = new Logger('Bootstrap');

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('ChitChat API')
      .setDescription('Endpoints should used by ChitChat client.')
      .setVersion('1.0.0')
      .addServer('/api')
      .addCookieAuth(
        'cookieAuth',
        {
          type: 'http',
          scheme: 'bearer',
          name: 'Authorization',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'cookieAuth'
      )
      .addSecurityRequirements('cookieAuth')
      .build();

    const options: SwaggerDocumentOptions = {
      ignoreGlobalPrefix: true,
      deepScanRoutes: true,
    };

    const document = SwaggerModule.createDocument(app, config, options);

    SwaggerModule.setup('swagger', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        filter: true,
      },
      customSiteTitle: 'CHITCHAT DEV API: Swagger UI',
    });

    await httpAdapter.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(document);
    });

    // Start application
    await app.listen(
      configService.get<number>('HTTP_PORT', 9090),
      configService.get<string>('LISTEN_INTERFACE', '0.0.0.0'),
      () =>
        logger.log(
          'Application is listening on port ' +
            configService.get<number>('HTTP_PORT', 9090)
        )
    );
  } catch (e) {
    console.log(e, 'error');
  }
};

bootstrap()
  .then((entity) => {
    return entity;
  })
  .catch((err) => {
    console.log(err);
    throw err;
    //process.exit(1);
  });

process.on('unhandledRejection', (reason) => {
  console.log(reason);
});
