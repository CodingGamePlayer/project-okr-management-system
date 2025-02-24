import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OKR, OKRAssignment, OKRKeyResult, User } from '../../common/entities';
import { OKRController } from './okr.controller';
import { OKRService } from './okr.service';

@Module({
  imports: [TypeOrmModule.forFeature([OKR, OKRAssignment, OKRKeyResult, User])],
  controllers: [OKRController],
  providers: [OKRService],
  exports: [OKRService],
})
export class OKRModule {}
