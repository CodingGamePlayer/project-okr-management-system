import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OKRService } from './okr.service';
import { OKR, OKRKeyResult, OKRAssignment } from '../../common/entities';
import { CreateOKRDto } from './dto/create-okr.dto';
import { UpdateOKRDto } from './dto/update-okr.dto';
import { CreateKeyResultDto } from './dto/create-key-result.dto';
import { UpdateKeyResultDto } from './dto/update-key-result.dto';
import { CreateOKRAssignmentDto } from './dto/create-okr-assignment.dto';
import { UpdateOKRAssignmentRoleDto } from './dto/update-okr-assignment-role.dto';

@ApiTags('OKR')
@Controller('okr')
export class OKRController {
  constructor(private readonly okrService: OKRService) {}

  @Post()
  @ApiOperation({ summary: 'OKR 생성', description: '새로운 OKR을 생성합니다.' })
  @ApiResponse({ status: 201, description: 'OKR이 성공적으로 생성되었습니다.', type: OKR })
  create(@Body() createOKRDto: CreateOKRDto): Promise<OKR> {
    return this.okrService.create(createOKRDto);
  }

  @Get()
  @ApiOperation({ summary: 'OKR 목록 조회', description: '모든 OKR 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: 'OKR 목록을 성공적으로 조회했습니다.', type: [OKR] })
  findAll(): Promise<OKR[]> {
    return this.okrService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 OKR 조회', description: 'ID로 특정 OKR을 조회합니다.' })
  @ApiParam({ name: 'id', description: 'OKR ID' })
  @ApiResponse({ status: 200, description: 'OKR을 성공적으로 조회했습니다.', type: OKR })
  @ApiResponse({ status: 404, description: 'OKR을 찾을 수 없습니다.' })
  findOne(@Param('id') id: string): Promise<OKR> {
    return this.okrService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'OKR 수정', description: '특정 OKR의 정보를 수정합니다.' })
  @ApiParam({ name: 'id', description: 'OKR ID' })
  @ApiResponse({ status: 200, description: 'OKR이 성공적으로 수정되었습니다.', type: OKR })
  @ApiResponse({ status: 404, description: 'OKR을 찾을 수 없습니다.' })
  update(@Param('id') id: string, @Body() updateOKRDto: UpdateOKRDto): Promise<OKR> {
    return this.okrService.update(+id, updateOKRDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'OKR 삭제', description: '특정 OKR을 삭제합니다.' })
  @ApiParam({ name: 'id', description: 'OKR ID' })
  @ApiResponse({ status: 200, description: 'OKR이 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: 'OKR을 찾을 수 없습니다.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.okrService.remove(+id);
  }

  @Post(':id/key-results')
  @ApiOperation({ summary: 'Key Result 생성', description: 'OKR에 새로운 Key Result를 추가합니다.' })
  @ApiParam({ name: 'id', description: 'OKR ID' })
  @ApiResponse({ status: 201, description: 'Key Result가 성공적으로 생성됨', type: OKRKeyResult })
  @ApiResponse({ status: 404, description: 'OKR을 찾을 수 없음' })
  @ApiResponse({ status: 409, description: '가중치 합계가 100을 초과함' })
  createKeyResult(@Param('id') id: string, @Body() createKeyResultDto: CreateKeyResultDto): Promise<OKRKeyResult> {
    return this.okrService.createKeyResult(+id, createKeyResultDto);
  }

  @Get(':id/key-results')
  @ApiOperation({ summary: 'Key Result 목록 조회', description: 'OKR의 모든 Key Result를 조회합니다.' })
  @ApiParam({ name: 'id', description: 'OKR ID' })
  @ApiResponse({ status: 200, description: 'Key Result 목록 조회 성공', type: [OKRKeyResult] })
  @ApiResponse({ status: 404, description: 'OKR을 찾을 수 없음' })
  getKeyResults(@Param('id') id: string): Promise<OKRKeyResult[]> {
    return this.okrService.getKeyResults(+id);
  }

  @Patch(':okrId/key-results/:keyResultId')
  @ApiOperation({ summary: 'Key Result 수정', description: '특정 Key Result의 정보를 수정합니다.' })
  @ApiParam({ name: 'okrId', description: 'OKR ID' })
  @ApiParam({ name: 'keyResultId', description: 'Key Result ID' })
  @ApiResponse({ status: 200, description: 'Key Result 수정 성공', type: OKRKeyResult })
  @ApiResponse({ status: 404, description: 'OKR 또는 Key Result를 찾을 수 없음' })
  @ApiResponse({ status: 409, description: '가중치 합계가 100을 초과함' })
  updateKeyResult(
    @Param('okrId') okrId: string,
    @Param('keyResultId') keyResultId: string,
    @Body() updateKeyResultDto: UpdateKeyResultDto,
  ): Promise<OKRKeyResult> {
    return this.okrService.updateKeyResult(+okrId, +keyResultId, updateKeyResultDto);
  }

  @Delete(':okrId/key-results/:keyResultId')
  @ApiOperation({ summary: 'Key Result 삭제', description: '특정 Key Result를 삭제합니다.' })
  @ApiParam({ name: 'okrId', description: 'OKR ID' })
  @ApiParam({ name: 'keyResultId', description: 'Key Result ID' })
  @ApiResponse({ status: 200, description: 'Key Result 삭제 성공' })
  @ApiResponse({ status: 404, description: 'OKR 또는 Key Result를 찾을 수 없음' })
  deleteKeyResult(@Param('okrId') okrId: string, @Param('keyResultId') keyResultId: string): Promise<void> {
    return this.okrService.deleteKeyResult(+okrId, +keyResultId);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'OKR 담당자 할당', description: 'OKR에 새로운 담당자를 할당합니다.' })
  @ApiParam({ name: 'id', description: 'OKR ID' })
  @ApiResponse({ status: 201, description: '담당자가 성공적으로 할당됨', type: OKRAssignment })
  @ApiResponse({ status: 404, description: 'OKR 또는 사용자를 찾을 수 없음' })
  @ApiResponse({ status: 409, description: '이미 할당된 담당자이거나 OWNER가 이미 존재함' })
  assignMember(@Param('id') id: string, @Body() assignmentDto: CreateOKRAssignmentDto): Promise<OKRAssignment> {
    return this.okrService.assignMember(+id, assignmentDto);
  }

  @Delete(':okrId/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'OKR 담당자 제거', description: 'OKR에서 담당자를 제거합니다.' })
  @ApiParam({ name: 'okrId', description: 'OKR ID' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({ status: 204, description: '담당자가 성공적으로 제거됨' })
  @ApiResponse({ status: 404, description: '할당 정보를 찾을 수 없음' })
  @ApiResponse({ status: 409, description: '유일한 OWNER는 제거할 수 없음' })
  removeMember(@Param('okrId') okrId: string, @Param('userId') userId: string): Promise<void> {
    return this.okrService.removeMember(+okrId, +userId);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'OKR 담당자 목록 조회', description: 'OKR의 모든 담당자를 조회합니다.' })
  @ApiParam({ name: 'id', description: 'OKR ID' })
  @ApiResponse({ status: 200, description: '담당자 목록 조회 성공', type: [OKRAssignment] })
  @ApiResponse({ status: 404, description: 'OKR을 찾을 수 없음' })
  getAssignedMembers(@Param('id') id: string): Promise<OKRAssignment[]> {
    return this.okrService.getAssignedMembers(+id);
  }

  @Patch(':okrId/members/:userId/role')
  @ApiOperation({ summary: '담당자 역할 수정', description: 'OKR 담당자의 역할을 수정합니다.' })
  @ApiParam({ name: 'okrId', description: 'OKR ID' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({ status: 200, description: '역할 수정 성공', type: OKRAssignment })
  @ApiResponse({ status: 400, description: '잘못된 역할 값' })
  @ApiResponse({ status: 404, description: '할당 정보를 찾을 수 없음' })
  @ApiResponse({ status: 409, description: '유일한 OWNER의 역할은 변경할 수 없음' })
  updateMemberRole(
    @Param('okrId') okrId: string,
    @Param('userId') userId: string,
    @Body() updateRoleDto: UpdateOKRAssignmentRoleDto,
  ): Promise<OKRAssignment> {
    return this.okrService.updateMemberRole(+okrId, +userId, updateRoleDto.role);
  }
}
