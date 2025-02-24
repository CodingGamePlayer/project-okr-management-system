import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectAssignmentDto } from './dto/create-project-assignment.dto';
import { UpdateProjectMemberRoleDto } from './dto/update-project-member-role.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Project')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: '프로젝트 생성', description: '새로운 프로젝트를 생성합니다.' })
  @ApiResponse({ status: 201, description: '프로젝트가 성공적으로 생성됨' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '매니저 또는 상위 프로젝트를 찾을 수 없음' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: '프로젝트 목록 조회', description: '모든 프로젝트 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '프로젝트 목록 조회 성공' })
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '프로젝트 상세 조회', description: '특정 프로젝트의 상세 정보를 조회합니다.' })
  @ApiParam({ name: 'id', description: '프로젝트 ID' })
  @ApiResponse({ status: 200, description: '프로젝트 조회 성공' })
  @ApiResponse({ status: 404, description: '프로젝트를 찾을 수 없음' })
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '프로젝트 정보 수정', description: '특정 프로젝트의 정보를 수정합니다.' })
  @ApiParam({ name: 'id', description: '프로젝트 ID' })
  @ApiResponse({ status: 200, description: '프로젝트 정보 수정 성공' })
  @ApiResponse({ status: 404, description: '프로젝트를 찾을 수 없음' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '프로젝트 삭제', description: '특정 프로젝트를 삭제합니다.' })
  @ApiParam({ name: 'id', description: '프로젝트 ID' })
  @ApiResponse({ status: 204, description: '프로젝트 삭제 성공' })
  @ApiResponse({ status: 404, description: '프로젝트를 찾을 수 없음' })
  @ApiResponse({ status: 409, description: '하위 프로젝트가 있어 삭제할 수 없음' })
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: '프로젝트 멤버 할당', description: '프로젝트에 새로운 멤버를 할당합니다.' })
  @ApiParam({ name: 'id', description: '프로젝트 ID' })
  @ApiResponse({ status: 201, description: '멤버 할당 성공' })
  @ApiResponse({ status: 404, description: '프로젝트 또는 사용자를 찾을 수 없음' })
  @ApiResponse({ status: 409, description: '이미 할당된 멤버' })
  assignMember(@Param('id') id: string, @Body() assignmentDto: CreateProjectAssignmentDto) {
    return this.projectService.assignMember(+id, assignmentDto);
  }

  @Delete(':projectId/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '프로젝트 멤버 제거', description: '프로젝트에서 멤버를 제거합니다.' })
  @ApiParam({ name: 'projectId', description: '프로젝트 ID' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({ status: 204, description: '멤버 제거 성공' })
  @ApiResponse({ status: 404, description: '할당 정보를 찾을 수 없음' })
  removeMember(@Param('projectId') projectId: string, @Param('userId') userId: string) {
    return this.projectService.removeMember(+projectId, +userId);
  }

  @Get(':id/members')
  @ApiOperation({ summary: '프로젝트 멤버 조회', description: '프로젝트의 모든 멤버를 조회합니다.' })
  @ApiParam({ name: 'id', description: '프로젝트 ID' })
  @ApiResponse({ status: 200, description: '멤버 조회 성공' })
  getProjectMembers(@Param('id') id: string) {
    return this.projectService.getProjectMembers(+id);
  }

  @Patch(':projectId/members/:userId/role')
  @ApiOperation({ summary: '멤버 역할 수정', description: '프로젝트 멤버의 역할을 수정합니다.' })
  @ApiParam({ name: 'projectId', description: '프로젝트 ID' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({ status: 200, description: '역할 수정 성공' })
  @ApiResponse({ status: 400, description: '잘못된 역할 값' })
  @ApiResponse({ status: 404, description: '할당 정보를 찾을 수 없음' })
  updateMemberRole(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @Body() updateRoleDto: UpdateProjectMemberRoleDto,
  ) {
    return this.projectService.updateMemberRole(+projectId, +userId, updateRoleDto.role);
  }
}
