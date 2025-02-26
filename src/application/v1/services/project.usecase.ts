import { Injectable } from '@nestjs/common';
import { ProjectService } from 'src/domain/project/project.service';

@Injectable()
export class ProjectUsecase {
  constructor(private readonly projectService: ProjectService) {}

  // 여기에 프로젝트 관련 비즈니스 로직 구현
}
