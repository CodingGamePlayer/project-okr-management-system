import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entities } from './common/entities';
import { env } from './common/env/env';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...env.database,
      entities: Entities,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
