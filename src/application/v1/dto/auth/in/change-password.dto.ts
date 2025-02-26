import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: '현재 비밀번호',
    example: 'currentPassword123',
  })
  @IsNotEmpty({ message: '현재 비밀번호는 필수입니다' })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: '새 비밀번호',
    example: 'newPassword123',
  })
  @IsNotEmpty({ message: '새 비밀번호는 필수입니다' })
  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
  newPassword: string;
}
