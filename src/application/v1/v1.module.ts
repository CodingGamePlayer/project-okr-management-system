import { Module } from '@nestjs/common';
import { V1Service } from './v1.service';
import { V1Controller } from './v1.controller';
import { DomainModule } from 'src/domain/domain.module';
import { ProjectUsecase } from './services/project.usecase';
import { UserUsecase } from './services/user.usecase';
import { AuthUsecase } from './services/auth.usecase';
import { RoleUsecase } from './services/role.usecase';
import { AuthController } from './controllers/auth.api';
@Module({
  imports: [DomainModule],
  controllers: [V1Controller, AuthController],
  providers: [V1Service, ProjectUsecase, UserUsecase, AuthUsecase, RoleUsecase],
})
export class V1Module {}
