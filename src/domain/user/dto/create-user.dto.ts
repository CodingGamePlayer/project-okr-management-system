import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: '사용자 이름',
  })
  @IsString()
  @MinLength(4)
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: '이메일 주소',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: '비밀번호',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
