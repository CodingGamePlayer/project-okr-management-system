import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [UserModule, RoleModule, ProjectModule],
})
export class DomainModule {}
