import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project, User, ProjectAssignment } from 'src/common/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User, ProjectAssignment])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
