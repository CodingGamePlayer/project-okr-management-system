import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@ApiTags('Role')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: '역할 생성', description: '새로운 역할을 생성합니다.' })
  @ApiResponse({ status: 201, description: '역할이 성공적으로 생성됨', type: CreateRoleDto })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 409, description: '이미 존재하는 역할' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: '역할 목록 조회', description: '모든 역할 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '역할 목록 조회 성공', type: [CreateRoleDto] })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '역할 상세 조회', description: '특정 역할의 상세 정보를 조회합니다.' })
  @ApiParam({ name: 'id', description: '역할 ID' })
  @ApiResponse({ status: 200, description: '역할 조회 성공', type: CreateRoleDto })
  @ApiResponse({ status: 404, description: '역할을 찾을 수 없음' })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '역할 정보 수정', description: '특정 역할의 정보를 수정합니다.' })
  @ApiParam({ name: 'id', description: '역할 ID' })
  @ApiResponse({ status: 200, description: '역할 정보 수정 성공', type: UpdateRoleDto })
  @ApiResponse({ status: 404, description: '역할을 찾을 수 없음' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    if (updateRoleDto.name !== undefined && updateRoleDto.name.trim() === '') {
      throw new BadRequestException('Role name cannot be empty');
    }
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '역할 삭제', description: '특정 역할을 삭제합니다.' })
  @ApiParam({ name: 'id', description: '역할 ID' })
  @ApiResponse({ status: 204, description: '역할 삭제 성공' })
  @ApiResponse({ status: 404, description: '역할을 찾을 수 없음' })
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }

  @Get(':id/users')
  @ApiOperation({ summary: '역할별 사용자 목록 조회', description: '특정 역할을 가진 모든 사용자를 조회합니다.' })
  @ApiParam({ name: 'id', description: '역할 ID' })
  @ApiResponse({ status: 200, description: '사용자 목록 조회 성공' })
  @ApiResponse({ status: 404, description: '역할을 찾을 수 없음' })
  getUsersByRole(@Param('id') id: string) {
    return this.roleService.getUsersByRole(+id);
  }

  @Get('name/:name/users')
  @ApiOperation({
    summary: '역할 이름별 사용자 목록 조회',
    description: '특정 이름의 역할을 가진 모든 사용자를 조회합니다.',
  })
  @ApiParam({ name: 'name', description: '역할 이름' })
  @ApiResponse({ status: 200, description: '사용자 목록 조회 성공' })
  @ApiResponse({ status: 404, description: '역할을 찾을 수 없음' })
  getUsersByRoleName(@Param('name') name: string) {
    return this.roleService.getUsersByRoleName(name);
  }

  @Get('search')
  @ApiOperation({ summary: '역할 이름으로 검색', description: '역할 이름으로 역할을 검색합니다 (부분 일치).' })
  @ApiQuery({ name: 'name', description: '검색할 역할 이름', required: true })
  @ApiResponse({ status: 200, description: '역할 검색 성공' })
  searchByName(@Query('name') name: string) {
    if (!name || name.trim() === '') {
      throw new BadRequestException('검색어를 입력해주세요');
    }
    return this.roleService.searchByName(name);
  }

  @Get('name/:name')
  @ApiOperation({ summary: '역할 이름으로 조회', description: '특정 이름의 역할을 조회합니다.' })
  @ApiParam({ name: 'name', description: '역할 이름' })
  @ApiResponse({ status: 200, description: '역할 조회 성공' })
  @ApiResponse({ status: 404, description: '역할을 찾을 수 없음' })
  findByName(@Param('name') name: string) {
    return this.roleService.findByName(name);
  }
}
