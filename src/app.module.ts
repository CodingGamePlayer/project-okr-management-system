import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationModule } from './application/application.module';
import { Entities } from './common/entities';
import { DomainModule } from './domain/domain.module';
import { typeOrmConfig } from './common/env/typeorm.config';
import { V1Module } from './application/v1/v1.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      entities: Entities,
    }),
    DomainModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
