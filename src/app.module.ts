import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entities } from './entities';
import { env } from './common/env/env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...env.database,
      entities: Entities,
    }),
  ],
})
export class AppModule {}
