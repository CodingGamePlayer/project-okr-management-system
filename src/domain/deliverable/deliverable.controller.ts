import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeliverableService } from './deliverable.service';
import { Deliverable, DeliverableType } from '../../common/entities/Deliverable.entity';
import { DeliverableAssignment } from '../../common/entities/DeliverableAssignment.entity';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { CreateDeliverableAssignmentDto } from './dto/create-deliverable-assignment.dto';

@ApiTags('Deliverable')
@Controller('deliverable')
export class DeliverableController {
  constructor(private readonly deliverableService: DeliverableService) {}

  @Post()
  @ApiOperation({ summary: '산출물 생성', description: '새로운 산출물을 생성합니다.' })
  @ApiResponse({ status: 201, description: '산출물이 성공적으로 생성되었습니다.', type: Deliverable })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'string', enum: ['FILE', 'LINK'] },
        file: { type: 'string', format: 'binary' },
        link: { type: 'string' },
        creator_id: { type: 'number' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createDeliverableDto: CreateDeliverableDto,
    @UploadedFile() file?: { path: string },
  ): Promise<Deliverable> {
    if (createDeliverableDto.type === DeliverableType.FILE && !file) {
      throw new BadRequestException('FILE 타입의 산출물은 파일이 필요합니다.');
    }

    if (file) {
      createDeliverableDto.file_path = file.path.replace(/\\/g, '/');
    }

    return this.deliverableService.create(createDeliverableDto);
  }

  @Get()
  @ApiOperation({ summary: '산출물 목록 조회', description: '모든 산출물 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '산출물 목록을 성공적으로 조회했습니다.', type: [Deliverable] })
  findAll(): Promise<Deliverable[]> {
    return this.deliverableService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 산출물 조회', description: 'ID로 특정 산출물을 조회합니다.' })
  @ApiResponse({ status: 200, description: '산출물을 성공적으로 조회했습니다.', type: Deliverable })
  @ApiResponse({ status: 404, description: '산출물을 찾을 수 없습니다.' })
  findOne(@Param('id') id: string): Promise<Deliverable> {
    return this.deliverableService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '산출물 삭제', description: '특정 산출물을 삭제합니다.' })
  @ApiResponse({ status: 200, description: '산출물이 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '산출물을 찾을 수 없습니다.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.deliverableService.remove(+id);
  }

  @Post(':id/assign')
  @ApiOperation({ summary: '산출물 할당', description: '산출물을 OKR이나 프로젝트에 할당합니다.' })
  @ApiResponse({ status: 201, description: '산출물이 성공적으로 할당되었습니다.', type: DeliverableAssignment })
  @ApiResponse({ status: 400, description: 'OKR이나 프로젝트 중 하나는 반드시 지정해야 합니다.' })
  @ApiResponse({ status: 404, description: '산출물, OKR 또는 프로젝트를 찾을 수 없습니다.' })
  assign(
    @Param('id') id: string,
    @Body() assignmentDto: CreateDeliverableAssignmentDto,
  ): Promise<DeliverableAssignment> {
    return this.deliverableService.assign(+id, assignmentDto);
  }

  @Delete(':id/unassign')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '산출물 할당 해제', description: '산출물의 할당을 해제합니다.' })
  @ApiResponse({ status: 204, description: '산출물 할당이 성공적으로 해제되었습니다.' })
  @ApiResponse({ status: 404, description: '할당 정보를 찾을 수 없습니다.' })
  unassign(@Param('id') id: string, @Body() assignmentDto: CreateDeliverableAssignmentDto): Promise<void> {
    return this.deliverableService.unassign(+id, assignmentDto);
  }

  @Get(':id/assignments')
  @ApiOperation({ summary: '산출물 할당 목록 조회', description: '산출물의 모든 할당 정보를 조회합니다.' })
  @ApiResponse({ status: 200, description: '할당 목록을 성공적으로 조회했습니다.', type: [DeliverableAssignment] })
  @ApiResponse({ status: 404, description: '산출물을 찾을 수 없습니다.' })
  getAssignments(@Param('id') id: string): Promise<DeliverableAssignment[]> {
    return this.deliverableService.getAssignments(+id);
  }
}
