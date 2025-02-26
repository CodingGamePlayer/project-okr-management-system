import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: '사용자 이름',
    required: false,
    example: 'newUsername',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: '사용자 이메일',
    required: false,
    example: 'newemail@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요' })
  email?: string;

  isVerified?: boolean;
}
