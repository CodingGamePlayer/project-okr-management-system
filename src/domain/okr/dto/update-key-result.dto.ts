import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateKeyResultDto } from './create-key-result.dto';

export class UpdateKeyResultDto extends PartialType(CreateKeyResultDto) {
  @ApiProperty({
    description: 'Key Result 이름',
    example: '신규 고객 600명 유치',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Key Result 설명',
    example: '온라인 마케팅 캠페인을 통한 신규 고객 유치',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '목표 값',
    example: 600,
    required: false,
  })
  target_value?: number;

  @ApiProperty({
    description: '현재 값',
    example: 150,
    required: false,
  })
  current_value?: number;

  @ApiProperty({
    description: '가중치 (1-100)',
    example: 40,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  weight?: number;
}
