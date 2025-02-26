import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ProjectModule } from './project/project.module';
import { OKRModule } from './okr/okr.module';
import { DeliverableModule } from './deliverable/deliverable.module';

@Module({
  imports: [UserModule, RoleModule, ProjectModule, OKRModule, DeliverableModule],
  exports: [UserModule, RoleModule, ProjectModule, OKRModule, DeliverableModule],
})
export class DomainModule {}
