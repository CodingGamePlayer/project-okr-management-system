import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOKRDto } from './create-okr.dto';

export class UpdateOKRDto extends PartialType(CreateOKRDto) {
  @ApiProperty({
    description: 'OKR 이름 (선택)',
    required: false,
    example: '2024년 1분기 매출 증대 목표 수정',
  })
  name?: string;

  @ApiProperty({
    description: '상위 OKR ID (선택)',
    required: false,
    example: 2,
  })
  parent_id?: number;

  @ApiProperty({
    description: '프로젝트 ID (선택)',
    required: false,
    example: 1,
  })
  project_id?: number;

  @ApiProperty({
    description: '관리자 ID (선택)',
    required: false,
    example: 1,
  })
  manager_id?: number;

  @ApiProperty({
    description: '시작일 (선택)',
    required: false,
    example: '2024-01-15',
  })
  start_date?: Date;

  @ApiProperty({
    description: '종료일 (선택)',
    required: false,
    example: '2024-03-31',
  })
  end_date?: Date;

  @ApiProperty({
    description: '진행률 (0-100) (선택)',
    required: false,
    example: 25,
    minimum: 0,
    maximum: 100,
  })
  progress?: number;
}
