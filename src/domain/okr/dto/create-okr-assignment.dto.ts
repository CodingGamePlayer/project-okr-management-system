import { IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum OKRAssignmentRole {
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

export class CreateOKRAssignmentDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: '담당자 역할',
    enum: OKRAssignmentRole,
    enumName: 'OKRAssignmentRole',
    example: OKRAssignmentRole.MEMBER,
  })
  @IsEnum(OKRAssignmentRole)
  role: OKRAssignmentRole;
}
