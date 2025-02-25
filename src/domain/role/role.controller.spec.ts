import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleController } from './role.controller';
import { Role, User } from 'src/common/entities';

describe('RoleController', () => {
  let controller: RoleController;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    controller = module.get<RoleController>(RoleController);
    dataSource = module.get<DataSource>(DataSource);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createRoleDto: CreateRoleDto = {
      name: 'ADMIN',
    };

    it('should create a role successfully', async () => {
      const result = await controller.create(createRoleDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(createRoleDto.name);
      expect(result.id).toBeDefined();
    });

    it('should throw ConflictException when role already exists', async () => {
      await controller.create(createRoleDto);
      await expect(controller.create(createRoleDto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException when name is empty', async () => {
      const invalidDto = { name: '' };
      await expect(controller.create(invalidDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const createRoleDto1: CreateRoleDto = {
        name: 'ADMIN',
      };
      const createRoleDto2: CreateRoleDto = {
        name: 'USER',
      };

      await controller.create(createRoleDto1);
      await controller.create(createRoleDto2);

      const result = await controller.findAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].name).toBe(createRoleDto1.name);
      expect(result[1].name).toBe(createRoleDto2.name);
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'ADMIN',
      };

      const createdRole = await controller.create(createRoleDto);
      const result = await controller.findOne(String(createdRole.id));

      expect(result).toBeDefined();
      expect(result.name).toBe(createRoleDto.name);
    });

    it('should throw NotFoundException when role not found', async () => {
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a role successfully', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'ADMIN',
      };

      const createdRole = await controller.create(createRoleDto);
      const updateRoleDto: UpdateRoleDto = {
        name: 'SUPER_ADMIN',
      };

      const result = await controller.update(String(createdRole.id), updateRoleDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(updateRoleDto.name);
    });

    it('should throw BadRequestException when updating with empty name', async () => {
      // 역할 생성
      const createRoleDto: CreateRoleDto = {
        name: 'ADMIN',
      };
      const createdRole = await controller.create(createRoleDto);

      // 빈 문자열로 업데이트 시도
      const updateRoleDto: UpdateRoleDto = {
        name: '',
      };
      
      try {
        await controller.update(String(createdRole.id), updateRoleDto);
        fail('Should throw BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Role name cannot be empty');
      }

      // 공백 문자열로 업데이트 시도
      const updateRoleDto2: UpdateRoleDto = {
        name: '   ',
      };
      
      try {
        await controller.update(String(createdRole.id), updateRoleDto2);
        fail('Should throw BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Role name cannot be empty');
      }
    });

    it('should throw NotFoundException when role not found', async () => {
      const updateRoleDto: UpdateRoleDto = {
        name: 'SUPER_ADMIN',
      };

      await expect(controller.update('999', updateRoleDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when updating to existing role name', async () => {
      const role1 = await controller.create({ name: 'ADMIN' });
      await controller.create({ name: 'USER' });

      await expect(
        controller.update(String(role1.id), { name: 'USER' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a role successfully', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'ADMIN',
      };

      const createdRole = await controller.create(createRoleDto);
      await controller.remove(String(createdRole.id));

      await expect(controller.findOne(String(createdRole.id))).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when role not found', async () => {
      // 존재하지 않는 ID로 삭제 시도
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
      
      // 에러 메시지 확인
      try {
        await controller.remove('999');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Role with ID 999 not found');
      }
    });

    it('should throw BadRequestException when trying to delete role assigned to users', async () => {
      // 역할 생성
      const role = await controller.create({ name: 'ADMIN' });

      // 사용자 생성 및 역할 할당
      const userRepository = dataSource.getRepository(User);
      const user = await userRepository.save({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        roles: [role],
      });

      // 할당된 역할 삭제 시도
      await expect(controller.remove(String(role.id))).rejects.toThrow(BadRequestException);
      
      try {
        await controller.remove(String(role.id));
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Cannot delete role that is assigned to users');
      }
    });
  });
});
