import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'ADMIN',
    description: '역할 이름',
  })
  @IsString()
  @MinLength(2)
  name: string;
}
