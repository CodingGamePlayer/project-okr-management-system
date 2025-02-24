import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, User, ProjectAssignment } from 'src/common/entities';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectAssignmentDto } from './dto/create-project-assignment.dto';
import { ProjectMemberRole } from './dto/update-project-member-role.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ProjectAssignment)
    private projectAssignmentRepository: Repository<ProjectAssignment>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    // 매니저 존재 여부 확인
    const manager = await this.userRepository.findOne({
      where: { id: createProjectDto.manager_id },
    });
    if (!manager) {
      throw new NotFoundException(`Manager with ID ${createProjectDto.manager_id} not found`);
    }

    // 상위 프로젝트 존재 여부 확인
    if (createProjectDto.parent_id) {
      const parentProject = await this.projectRepository.findOne({
        where: { id: createProjectDto.parent_id },
      });
      if (!parentProject) {
        throw new NotFoundException(`Parent project with ID ${createProjectDto.parent_id} not found`);
      }
    }

    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['manager', 'parent', 'children', 'assignments'],
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['manager', 'parent', 'children', 'assignments'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    if (updateProjectDto.manager_id) {
      const manager = await this.userRepository.findOne({
        where: { id: updateProjectDto.manager_id },
      });
      if (!manager) {
        throw new NotFoundException(`Manager with ID ${updateProjectDto.manager_id} not found`);
      }
    }

    if (updateProjectDto.parent_id) {
      const parentProject = await this.projectRepository.findOne({
        where: { id: updateProjectDto.parent_id },
      });
      if (!parentProject) {
        throw new NotFoundException(`Parent project with ID ${updateProjectDto.parent_id} not found`);
      }
      // 자기 자신을 상위 프로젝트로 지정하는 것 방지
      if (updateProjectDto.parent_id === id) {
        throw new ConflictException('Cannot set project as its own parent');
      }
    }

    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);

    // 하위 프로젝트가 있는지 확인
    if (project.children && project.children.length > 0) {
      throw new ConflictException('Cannot delete project with child projects');
    }

    await this.projectRepository.remove(project);
  }

  async assignMember(projectId: number, assignmentDto: CreateProjectAssignmentDto): Promise<ProjectAssignment> {
    const project = await this.findOne(projectId);

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const user = await this.userRepository.findOne({
      where: { id: assignmentDto.user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${assignmentDto.user_id} not found`);
    }

    // 이미 할당되어 있는지 확인
    const existingAssignment = await this.projectAssignmentRepository.findOne({
      where: {
        project_id: projectId,
        user_id: assignmentDto.user_id,
      },
    });

    if (existingAssignment) {
      throw new ConflictException('User is already assigned to this project');
    }

    const assignment = this.projectAssignmentRepository.create({
      project_id: projectId,
      user_id: assignmentDto.user_id,
      role: assignmentDto.role,
    });

    return this.projectAssignmentRepository.save(assignment);
  }

  async removeMember(projectId: number, userId: number): Promise<void> {
    const assignment = await this.projectAssignmentRepository.findOne({
      where: {
        project_id: projectId,
        user_id: userId,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    await this.projectAssignmentRepository.remove(assignment);
  }

  async getProjectMembers(projectId: number): Promise<ProjectAssignment[]> {
    return this.projectAssignmentRepository.find({
      where: { project_id: projectId },
      relations: ['user'],
    });
  }

  async updateMemberRole(projectId: number, userId: number, role: ProjectMemberRole): Promise<ProjectAssignment> {
    const assignment = await this.projectAssignmentRepository.findOne({
      where: {
        project_id: projectId,
        user_id: userId,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    assignment.role = role;
    return this.projectAssignmentRepository.save(assignment);
  }
}
