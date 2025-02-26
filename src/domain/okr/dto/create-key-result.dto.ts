import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { KeyResultUnit } from './key-result-unit.enum';

export class CreateKeyResultDto {
  @ApiProperty({
    description: 'Key Result 이름',
    example: '신규 고객 500명 유치',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Key Result 설명',
    example: '마케팅 캠페인을 통한 신규 고객 유치',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '측정 단위',
    enum: KeyResultUnit,
    example: KeyResultUnit.NUMBER,
    default: KeyResultUnit.NUMBER,
  })
  @IsEnum(KeyResultUnit)
  unit: KeyResultUnit;

  @ApiProperty({
    description: '목표 값 (단위에 따라 해석: NUMBER-개수, PERCENTAGE-%, CURRENCY-원, TIME-시간(분 단위), BOOLEAN-1)',
    example: 500,
  })
  @IsNumber()
  target_value: number;

  @ApiProperty({
    description:
      '현재 값 (단위에 따라 해석: NUMBER-개수, PERCENTAGE-%, CURRENCY-원, TIME-시간(분 단위), BOOLEAN-0 또는 1)',
    example: 0,
  })
  @IsNumber()
  current_value: number;

  @ApiProperty({
    description: '가중치 (1-100)',
    example: 30,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  weight: number;

  @ApiProperty({
    description: '마감일',
    example: '2024-03-31',
  })
  deadline: Date;
}
