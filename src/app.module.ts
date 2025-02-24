import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationModule } from './application/application.module';
import { Entities } from './common/entities';
import { env } from './common/env/env';
import { DomainModule } from './domain/domin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...env.database,
      entities: Entities,
      synchronize: true,
    }),
    DomainModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
