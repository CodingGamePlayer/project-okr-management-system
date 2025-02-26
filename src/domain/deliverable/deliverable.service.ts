import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deliverable, DeliverableType } from '../../common/entities/Deliverable.entity';
import { DeliverableAssignment } from '../../common/entities/DeliverableAssignment.entity';
import { OKR } from '../../common/entities/OKR.entity';
import { Project } from '../../common/entities/Project.entity';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { CreateDeliverableAssignmentDto } from './dto/create-deliverable-assignment.dto';
import * as fs from 'fs';

@Injectable()
export class DeliverableService {
  constructor(
    @InjectRepository(Deliverable)
    private readonly deliverableRepository: Repository<Deliverable>,
    @InjectRepository(DeliverableAssignment)
    private readonly assignmentRepository: Repository<DeliverableAssignment>,
    @InjectRepository(OKR)
    private readonly okrRepository: Repository<OKR>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createDeliverableDto: CreateDeliverableDto): Promise<Deliverable> {
    // 유효성 검사
    if (createDeliverableDto.type === DeliverableType.FILE && !createDeliverableDto.file_path) {
      throw new BadRequestException('FILE 타입의 산출물은 file_path가 필요합니다.');
    }
    if (createDeliverableDto.type === DeliverableType.LINK && !createDeliverableDto.link) {
      throw new BadRequestException('LINK 타입의 산출물은 link가 필요합니다.');
    }

    const deliverable = this.deliverableRepository.create(createDeliverableDto);
    return await this.deliverableRepository.save(deliverable);
  }

  async findAll(): Promise<Deliverable[]> {
    return await this.deliverableRepository.find({
      relations: ['assignments', 'assignments.okr', 'assignments.project'],
    });
  }

  async findOne(id: number): Promise<Deliverable> {
    const deliverable = await this.deliverableRepository.findOne({
      where: { id },
      relations: ['assignments', 'assignments.okr', 'assignments.project'],
    });

    if (!deliverable) {
      throw new NotFoundException(`산출물 ID ${id}를 찾을 수 없습니다.`);
    }

    return deliverable;
  }

  async remove(id: number): Promise<void> {
    const deliverable = await this.findOne(id);

    // 파일 타입이고 파일 경로가 있는 경우 파일 삭제
    if (deliverable.type === DeliverableType.FILE && deliverable.file_path) {
      try {
        await fs.promises.unlink(deliverable.file_path);
      } catch (error) {
        console.error('파일 삭제 중 오류 발생:', error);
      }
    }

    await this.deliverableRepository.remove(deliverable);
  }

  async assign(deliverableId: number, assignmentDto: CreateDeliverableAssignmentDto): Promise<DeliverableAssignment> {
    // 산출물 존재 여부 확인
    await this.findOne(deliverableId);

    // OKR이나 프로젝트 중 하나는 반드시 지정되어야 함
    if (!assignmentDto.okr_id && !assignmentDto.project_id) {
      throw new BadRequestException('OKR이나 프로젝트 중 하나는 반드시 지정해야 합니다.');
    }

    // OKR 유효성 검사
    if (assignmentDto.okr_id) {
      const okr = await this.okrRepository.findOne({ where: { id: assignmentDto.okr_id } });
      if (!okr) {
        throw new NotFoundException(`OKR ID ${assignmentDto.okr_id}를 찾을 수 없습니다.`);
      }
    }

    // 프로젝트 유효성 검사
    if (assignmentDto.project_id) {
      const project = await this.projectRepository.findOne({ where: { id: assignmentDto.project_id } });
      if (!project) {
        throw new NotFoundException(`프로젝트 ID ${assignmentDto.project_id}를 찾을 수 없습니다.`);
      }
    }

    const assignment = this.assignmentRepository.create({
      deliverable_id: deliverableId,
      ...assignmentDto,
    });

    return await this.assignmentRepository.save(assignment);
  }

  async unassign(deliverableId: number, assignmentDto: CreateDeliverableAssignmentDto): Promise<void> {
    const assignment = await this.assignmentRepository.findOne({
      where: {
        deliverable_id: deliverableId,
        okr_id: assignmentDto.okr_id,
        project_id: assignmentDto.project_id,
      },
    });

    if (!assignment) {
      throw new NotFoundException('할당 정보를 찾을 수 없습니다.');
    }

    await this.assignmentRepository.remove(assignment);
  }

  async getAssignments(deliverableId: number): Promise<DeliverableAssignment[]> {
    return this.assignmentRepository.find({
      where: { deliverable_id: deliverableId },
      relations: ['okr', 'project'],
    });
  }
}
