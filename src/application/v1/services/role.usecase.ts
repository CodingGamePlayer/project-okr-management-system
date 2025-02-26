import { Injectable } from '@nestjs/common';
import { RoleService } from 'src/domain/role/role.service';

@Injectable()
export class RoleUsecase {
  constructor(private readonly roleService: RoleService) {}
}
