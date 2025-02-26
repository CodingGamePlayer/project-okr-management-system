import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    example: '2024 OKR 시스템 개발',
    description: '프로젝트 이름',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 1,
    description: '상위 프로젝트 ID (선택)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @ApiProperty({
    example: 'DEVELOPMENT',
    description: '프로젝트 라벨',
    required: false,
  })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({
    example: 1,
    description: '프로젝트 관리자 ID',
  })
  @IsNumber()
  manager_id: number;
}
