import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { V1Module } from './v1/v1.module';

@Module({
  imports: [V1Module],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
