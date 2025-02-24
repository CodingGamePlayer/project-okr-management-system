import { Module } from '@nestjs/common';
import { DomainModules } from '.';

@Module({
  imports: [...DomainModules],
})
export class DomainModule {}
