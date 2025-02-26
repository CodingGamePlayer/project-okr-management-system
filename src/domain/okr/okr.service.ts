import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OKR, OKRAssignment, OKRKeyResult, User, Comment } from '../../common/entities';
import { CreateOKRDto } from './dto/create-okr.dto';
import { UpdateOKRDto } from './dto/update-okr.dto';
import { CreateKeyResultDto } from './dto/create-key-result.dto';
import { UpdateKeyResultDto } from './dto/update-key-result.dto';
import { KeyResultUnit } from './dto/key-result-unit.enum';
import { CreateOKRAssignmentDto, OKRAssignmentRole } from './dto/create-okr-assignment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IsNull } from 'typeorm';

@Injectable()
export class OKRService {
  constructor(
    @InjectRepository(OKR)
    private readonly okrRepository: Repository<OKR>,
    @InjectRepository(OKRAssignment)
    private readonly okrAssignmentRepository: Repository<OKRAssignment>,
    @InjectRepository(OKRKeyResult)
    private readonly okrKeyResultRepository: Repository<OKRKeyResult>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(createOKRDto: CreateOKRDto): Promise<OKR> {
    const okr = this.okrRepository.create(createOKRDto);
    return await this.okrRepository.save(okr);
  }

  async findAll(): Promise<OKR[]> {
    return await this.okrRepository.find({
      relations: ['manager', 'project', 'keyResults', 'assignments'],
    });
  }

  async findOne(id: number): Promise<OKR> {
    const okr = await this.okrRepository.findOne({
      where: { id },
      relations: ['manager', 'project', 'keyResults', 'assignments'],
    });
    if (!okr) {
      throw new NotFoundException(`OKR with ID ${id} not found`);
    }
    return okr;
  }

  async update(id: number, updateOKRDto: UpdateOKRDto): Promise<OKR> {
    await this.findOne(id);
    await this.okrRepository.update(id, updateOKRDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.okrRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`OKR with ID ${id} not found`);
    }
  }

  private calculateProgress(currentValue: number, targetValue: number, unit: KeyResultUnit): number {
    switch (unit) {
      case KeyResultUnit.NUMBER:
      case KeyResultUnit.CURRENCY:
      case KeyResultUnit.TIME:
        if (targetValue === 0) {
          throw new BadRequestException('Target value cannot be 0');
        }
        return (currentValue / targetValue) * 100;

      case KeyResultUnit.PERCENTAGE:
        if (currentValue > 100 || targetValue > 100) {
          throw new BadRequestException('Percentage values must be between 0 and 100');
        }
        return (currentValue / targetValue) * 100;

      case KeyResultUnit.BOOLEAN:
        if (![0, 1].includes(currentValue) || targetValue !== 1) {
          throw new BadRequestException('Boolean values must be 0 or 1, and target must be 1');
        }
        return currentValue * 100;

      default:
        throw new BadRequestException('Invalid unit type');
    }
  }

  async createKeyResult(okrId: number, createKeyResultDto: CreateKeyResultDto): Promise<OKRKeyResult> {
    const okr = await this.findOne(okrId);
    if (!okr) {
      throw new NotFoundException(`OKR with ID ${okrId} not found`);
    }

    // 가중치 합계가 100을 넘지 않는지 확인
    const existingKeyResults = await this.okrKeyResultRepository.find({
      where: { okr_id: okrId },
    });

    const totalWeight = existingKeyResults.reduce((sum, kr) => sum + kr.weight, 0) + createKeyResultDto.weight;
    if (totalWeight > 100) {
      throw new ConflictException('Total weight of Key Results cannot exceed 100');
    }

    // 진행률 계산
    const progress = this.calculateProgress(
      createKeyResultDto.current_value,
      createKeyResultDto.target_value,
      createKeyResultDto.unit,
    );

    const keyResult = this.okrKeyResultRepository.create({
      ...createKeyResultDto,
      okr_id: okrId,
      progress,
    });

    const savedKeyResult = await this.okrKeyResultRepository.save(keyResult);

    // OKR 진행률 업데이트
    await this.updateOKRProgress(okrId);

    return savedKeyResult;
  }

  async updateKeyResult(
    okrId: number,
    keyResultId: number,
    updateKeyResultDto: UpdateKeyResultDto,
  ): Promise<OKRKeyResult> {
    const keyResult = await this.okrKeyResultRepository.findOne({
      where: { id: keyResultId, okr_id: okrId },
    });

    if (!keyResult) {
      throw new NotFoundException(`Key Result with ID ${keyResultId} not found in OKR ${okrId}`);
    }

    // 가중치가 변경되는 경우, 전체 합이 100을 넘지 않는지 확인
    if (updateKeyResultDto.weight) {
      const otherKeyResults = await this.okrKeyResultRepository.find({
        where: { okr_id: okrId },
      });

      const totalWeight =
        otherKeyResults.filter((kr) => kr.id !== keyResultId).reduce((sum, kr) => sum + kr.weight, 0) +
        updateKeyResultDto.weight;

      if (totalWeight > 100) {
        throw new ConflictException('Total weight of Key Results cannot exceed 100');
      }
    }

    // 진행률 계산
    let progress = keyResult.progress;
    if (
      updateKeyResultDto.current_value !== undefined ||
      updateKeyResultDto.target_value !== undefined ||
      updateKeyResultDto.unit !== undefined
    ) {
      const currentValue = updateKeyResultDto.current_value ?? keyResult.current_value;
      const targetValue = updateKeyResultDto.target_value ?? keyResult.target_value;
      const unit = updateKeyResultDto.unit ?? keyResult.unit;
      progress = this.calculateProgress(currentValue, targetValue, unit);
    }

    Object.assign(keyResult, { ...updateKeyResultDto, progress });
    const updatedKeyResult = await this.okrKeyResultRepository.save(keyResult);

    // OKR 진행률 업데이트
    await this.updateOKRProgress(okrId);

    return updatedKeyResult;
  }

  async deleteKeyResult(okrId: number, keyResultId: number): Promise<void> {
    const keyResult = await this.okrKeyResultRepository.findOne({
      where: { id: keyResultId, okr_id: okrId },
    });

    if (!keyResult) {
      throw new NotFoundException(`Key Result with ID ${keyResultId} not found in OKR ${okrId}`);
    }

    await this.okrKeyResultRepository.remove(keyResult);

    // OKR 진행률 업데이트
    await this.updateOKRProgress(okrId);
  }

  async getKeyResults(okrId: number): Promise<OKRKeyResult[]> {
    const okr = await this.findOne(okrId);
    if (!okr) {
      throw new NotFoundException(`OKR with ID ${okrId} not found`);
    }

    return this.okrKeyResultRepository.find({
      where: { okr_id: okrId },
    });
  }

  private async updateOKRProgress(okrId: number): Promise<void> {
    const keyResults = await this.okrKeyResultRepository.find({
      where: { okr_id: okrId },
    });

    if (keyResults.length === 0) {
      return;
    }

    // 각 Key Result의 진행률을 가중치에 따라 계산
    const progress = keyResults.reduce((total, kr) => {
      return total + (kr.progress * kr.weight) / 100;
    }, 0);

    await this.okrRepository.update(okrId, { progress });
  }

  async assignMember(okrId: number, assignmentDto: CreateOKRAssignmentDto): Promise<OKRAssignment> {
    const okr = await this.findOne(okrId);
    if (!okr) {
      throw new NotFoundException(`OKR with ID ${okrId} not found`);
    }

    const user = await this.userRepository.findOne({
      where: { id: assignmentDto.user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${assignmentDto.user_id} not found`);
    }

    const assignment = this.okrAssignmentRepository.create({
      okr_id: okrId,
      user_id: assignmentDto.user_id,
      role: assignmentDto.role,
      okr: okr,
      user: user,
    });

    return this.okrAssignmentRepository.save(assignment);
  }

  async removeMember(okrId: number, userId: number): Promise<void> {
    const assignment = await this.okrAssignmentRepository.findOne({
      where: {
        okr_id: okrId,
        user_id: userId,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    await this.okrAssignmentRepository.remove(assignment);
  }

  async updateMemberRole(okrId: number, userId: number, role: OKRAssignmentRole): Promise<OKRAssignment> {
    const assignment = await this.okrAssignmentRepository.findOne({
      where: {
        okr_id: okrId,
        user_id: userId,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    assignment.role = role;

    return this.okrAssignmentRepository.save(assignment);
  }

  async getAssignedMembers(okrId: number): Promise<OKRAssignment[]> {
    const okr = await this.findOne(okrId);
    if (!okr) {
      throw new NotFoundException(`OKR with ID ${okrId} not found`);
    }

    return this.okrAssignmentRepository.find({
      where: { okr_id: okrId },
      relations: ['user'],
    });
  }

  async createComment(okrId: number, userId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const okr = await this.okrRepository.findOne({ where: { id: okrId } });
    if (!okr) {
      throw new NotFoundException('OKR를 찾을 수 없습니다.');
    }

    if (createCommentDto.parent_id) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: createCommentDto.parent_id, okr_id: okrId },
      });
      if (!parentComment) {
        throw new NotFoundException('부모 댓글을 찾을 수 없습니다.');
      }
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      okr_id: okrId,
      user_id: userId,
    });

    return this.commentRepository.save(comment);
  }

  async updateComment(commentId: number, userId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, user_id: userId },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없거나 수정 권한이 없습니다.');
    }

    await this.commentRepository.update(commentId, updateCommentDto);
    const updatedComment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!updatedComment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    return updatedComment;
  }

  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, user_id: userId },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없거나 삭제 권한이 없습니다.');
    }

    await this.commentRepository.delete(commentId);
  }

  async getComments(okrId: number): Promise<Comment[]> {
    // 최상위 댓글만 먼저 조회 (parent_id가 null인 댓글)
    const comments = await this.commentRepository.find({
      where: {
        okr_id: okrId,
        parent_id: IsNull(),
      },
      relations: ['user', 'replies', 'replies.user'],
      order: {
        created_at: 'DESC',
        replies: {
          created_at: 'ASC',
        },
      },
    });

    return comments;
  }

  // 특정 댓글의 답글 목록을 조회하는 메서드 추가
  async getReplies(commentId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { parent_id: commentId },
      relations: ['user'],
      order: {
        created_at: 'ASC',
      },
    });
  }
}
