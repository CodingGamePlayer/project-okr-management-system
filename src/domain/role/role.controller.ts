import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

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
}
