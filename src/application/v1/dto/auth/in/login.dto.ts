import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요' })
  email: string;

  @ApiProperty({
    description: '사용자 비밀번호 (선택적)',
    required: false,
    example: 'password123',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: '사용자 이름 (자동 회원가입 시 사용, 선택적)',
    required: false,
    example: 'username',
  })
  @IsOptional()
  @IsString()
  username?: string;
}
