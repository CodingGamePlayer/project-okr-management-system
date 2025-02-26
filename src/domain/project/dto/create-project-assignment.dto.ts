import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectAssignmentDto {
  @ApiProperty({
    example: 1,
    description: '사용자 ID',
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 'MANAGER',
    description: '프로젝트 내 역할 (MANAGER, MEMBER 등)',
  })
  @IsString()
  role: string;
}
