import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum ProjectMemberRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}

export class UpdateProjectMemberRoleDto {
  @ApiProperty({
    description: '프로젝트 멤버의 역할',
    enum: ProjectMemberRole,
    example: ProjectMemberRole.MEMBER,
  })
  @IsEnum(ProjectMemberRole, {
    message: '유효하지 않은 역할입니다. (OWNER, MANAGER, MEMBER, GUEST 중 하나여야 합니다)',
  })
  role: ProjectMemberRole;
}
