import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OKRAssignmentRole } from './create-okr-assignment.dto';

export class UpdateOKRAssignmentRoleDto {
  @ApiProperty({
    description: '변경할 담당자 역할',
    enum: OKRAssignmentRole,
    enumName: 'OKRAssignmentRole',
    example: OKRAssignmentRole.MEMBER,
  })
  @IsEnum(OKRAssignmentRole, {
    message: '유효하지 않은 역할입니다. (OWNER, MEMBER, VIEWER 중 하나여야 합니다)',
  })
  role: OKRAssignmentRole;
}
