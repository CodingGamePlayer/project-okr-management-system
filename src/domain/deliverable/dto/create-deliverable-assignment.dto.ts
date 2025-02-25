import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeliverableAssignmentDto {
  @ApiProperty({
    description: 'OKR ID (OKR에 할당하는 경우)',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  okr_id?: number;

  @ApiProperty({
    description: '프로젝트 ID (프로젝트에 할당하는 경우)',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  project_id?: number;
}
