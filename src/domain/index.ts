import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ProjectModule } from './project/project.module';
import { OKRModule } from './okr/okr.module';
import { DeliverableModule } from './deliverable/deliverable.module';

export const DomainModules = [UserModule, RoleModule, ProjectModule, OKRModule, DeliverableModule];
