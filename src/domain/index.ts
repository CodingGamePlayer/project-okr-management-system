import { ProjectModule } from './project/project.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

export const DomainModules = [UserModule, RoleModule, ProjectModule];
