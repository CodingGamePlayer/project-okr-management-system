import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOKRDto {
  @ApiProperty({
    description: 'OKR 이름',
    example: '2024년 1분기 매출 증대',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '상위 OKR ID',
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  parent_id?: number;

  @ApiProperty({
    description: '프로젝트 ID',
    example: 1,
  })
  @IsNumber()
  project_id: number;

  @ApiProperty({
    description: '관리자 ID',
    example: 1,
  })
  @IsNumber()
  manager_id: number;

  @ApiProperty({
    description: '시작일',
    example: '2024-01-01',
  })
  @IsDate()
  start_date: Date;

  @ApiProperty({
    description: '종료일',
    example: '2024-03-31',
  })
  @IsDate()
  end_date: Date;

  @ApiProperty({
    description: '진행률 (0-100)',
    example: 0,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  progress: number;
}
