import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ApplicationModule } from './application/application.module';
import { DomainModules } from './domain';
import { V1Module } from './application/v1/v1.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Domain API Documentation
  const domainConfig = new DocumentBuilder()
    .setTitle('Domain API')
    .setDescription('도메인 관련 API 문서')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const domainDocument = SwaggerModule.createDocument(app, domainConfig, {
    include: [...DomainModules],
  });
  SwaggerModule.setup('api/domain', app, domainDocument, {
    swaggerOptions: {
      docExpansion: 'none',
    },
  });

  // Application API Documentation
  const applicationConfig = new DocumentBuilder()
    .setTitle('Application API')
    .setDescription('애플리케이션 관련 API 문서')
    .setVersion('1.0')
    .addTag('application')
    .addBearerAuth()
    .build();

  const applicationDocument = SwaggerModule.createDocument(app, applicationConfig, {
    include: [V1Module],
  });
  SwaggerModule.setup('api/application', app, applicationDocument, {
    swaggerOptions: {
      docExpansion: 'none',
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap()
  .then(() => {
    console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  })
  .catch((error) => {
    console.error(error);
  });
