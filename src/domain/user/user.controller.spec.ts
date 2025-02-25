import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { Role } from 'src/common/entities';
import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<UserController>(UserController);
    dataSource = module.get<DataSource>(DataSource);

    await module.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    };

    it('should create a user successfully', async () => {
      const result = await controller.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
      expect(result.username).toBe(createUserDto.username);
      expect(result.password).toMatch(/^\$2b\$\d+\$/); // bcrypt 해시 패턴 확인
    });

    it('should throw ConflictException when user already exists', async () => {
      await controller.create(createUserDto);
      await expect(controller.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const createUserDto1: CreateUserDto = {
        email: 'test1@example.com',
        username: 'testuser1',
        password: 'password123',
      };
      const createUserDto2: CreateUserDto = {
        email: 'test2@example.com',
        username: 'testuser2',
        password: 'password123',
      };

      await controller.create(createUserDto1);
      await controller.create(createUserDto2);

      const result = await controller.findAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[1].email).toBe(createUserDto1.email);
      expect(result[0].email).toBe(createUserDto2.email);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const createdUser = await controller.create(createUserDto);
      const result = await controller.findOne(String(createdUser.id));

      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
    });

    it('should throw NotFoundException when user not found', async () => {
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const createdUser = await controller.create(createUserDto);
      const updateUserDto: UpdateUserDto = {
        username: 'newusername',
      };

      const result = await controller.update(String(createdUser.id), updateUserDto);

      expect(result).toBeDefined();
      expect(result.username).toBe(updateUserDto.username);
    });

    it('should throw NotFoundException when user not found', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'newusername',
      };

      await expect(controller.update('999', updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const createdUser = await controller.create(createUserDto);
      await controller.remove(String(createdUser.id));

      await expect(controller.findOne(String(createdUser.id))).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when user not found', async () => {
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('verifyEmail', () => {
    it('should verify user email successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const createdUser = await controller.create(createUserDto);
      const result = await controller.verifyEmail(String(createdUser.id));

      expect(result).toBeDefined();
      expect(result.isVerified).toBe(true);
    });

    it('should throw NotFoundException when user not found', async () => {
      await expect(controller.verifyEmail('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('assignRole', () => {
    let roleId: string;

    beforeEach(async () => {
      // 테스트용 역할 생성
      const roleRepository = dataSource.getRepository(Role);
      const role = await roleRepository.save({ name: 'ADMIN' });
      roleId = String(role.id);
    });

    it('should assign role to user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const createdUser = await controller.create(createUserDto);
      const result = await controller.assignRole(String(createdUser.id), roleId);

      expect(result).toBeDefined();
      expect(result.roles).toHaveLength(1);
      expect(result.roles[0].name).toBe('ADMIN');
    });

    it('should throw NotFoundException when user not found', async () => {
      await expect(controller.assignRole('999', roleId)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when role not found', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const createdUser = await controller.create(createUserDto);
      await expect(controller.assignRole(String(createdUser.id), '999')).rejects.toThrow(NotFoundException);
    });
  });
});
