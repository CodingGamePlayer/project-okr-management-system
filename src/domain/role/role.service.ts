import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from 'src/common/entities';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    if (!createRoleDto.name || createRoleDto.name.trim() === '') {
      throw new BadRequestException('Role name cannot be empty');
    }

    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException('Role already exists');
    }

    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (updateRoleDto.name) {
      if (updateRoleDto.name.trim() === '') {
        throw new BadRequestException('Role name cannot be empty');
      }

      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });

      if (existingRole && existingRole.id !== id) {
        throw new ConflictException('Role name already exists');
      }
    }

    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);

    // 역할이 사용자에게 할당되어 있는지 확인
    const roleWithUsers = await this.roleRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (roleWithUsers && roleWithUsers.users && roleWithUsers.users.length > 0) {
      throw new BadRequestException('Cannot delete role that is assigned to users');
    }

    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }

  async getUsersByRole(roleId: number): Promise<User[]> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['users'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return role.users;
  }

  async getUsersByRoleName(roleName: string): Promise<User[]> {
    const role = await this.roleRepository.findOne({
      where: { name: roleName },
      relations: ['users'],
    });

    if (!role) {
      throw new NotFoundException(`Role with name ${roleName} not found`);
    }

    return role.users;
  }
}
