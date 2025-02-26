import { BadRequestException, Body, Controller, Get, Post, Query, UnauthorizedException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/entities';
import { CreateUserDto } from 'src/domain/user/dto/create-user.dto';
import { ChangePasswordDto } from '../dto/auth/in/change-password.dto';
import { LoginDto } from '../dto/auth/in/login.dto';
import { ResetPasswordDto } from '../dto/auth/in/reset-password.dto';
import { UpdateProfileDto } from '../dto/auth/in/update-profile.dto';
import { LoginResponseDto } from '../dto/auth/out/login-response.dto';
import { UserResponseDto } from '../dto/auth/out/user-response.dto';
import { VerifyEmailResponseDto } from '../dto/auth/out/verify-email-response.dto';
import { SuccessResponseDto } from '../dto/common/success-response.dto';
import { AuthUsecase } from '../services/auth.usecase';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authUsecase: AuthUsecase) {}

  @Post('login')
  @ApiOperation({ summary: '로그인', description: '이메일로 로그인합니다. 사용자가 없으면 자동 회원가입됩니다.' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: '로그인 성공', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      console.log(loginDto);

      loginDto.password = undefined;
      loginDto.username = undefined;

      return await this.authUsecase.login(loginDto.email, loginDto.password, loginDto.username);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post('register')
  @ApiOperation({ summary: '회원가입', description: '새 사용자를 등록합니다.' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: '회원가입 성공', type: User })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.authUsecase.register(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('verify-email')
  @ApiOperation({ summary: '이메일 인증', description: '이메일 인증 토큰을 확인합니다.' })
  @ApiQuery({ name: 'token', description: '이메일 인증 토큰' })
  @ApiResponse({ status: 200, description: '이메일 인증 결과', type: VerifyEmailResponseDto })
  async verifyEmail(@Query('token') token: string): Promise<VerifyEmailResponseDto> {
    return await this.authUsecase.verifyEmail(token);
  }

  @Post('request-verification')
  @ApiOperation({ summary: '이메일 인증 요청', description: '이메일 인증 메일을 다시 요청합니다.' })
  @ApiQuery({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({ status: 200, description: '이메일 인증 요청 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async requestVerification(@Query('userId') userId: string): Promise<SuccessResponseDto> {
    try {
      await this.authUsecase.requestEmailVerification(parseInt(userId));
      return { success: true, message: '인증 이메일이 발송되었습니다.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('change-password')
  @ApiOperation({ summary: '비밀번호 변경', description: '로그인된 사용자의 비밀번호를 변경합니다.' })
  @ApiQuery({ name: 'userId', description: '사용자 ID' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: '비밀번호 변경 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async changePassword(
    @Query('userId') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<SuccessResponseDto> {
    try {
      await this.authUsecase.changePassword(parseInt(userId), changePasswordDto);
      return { success: true, message: '비밀번호가 변경되었습니다.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('update-profile')
  @ApiOperation({ summary: '프로필 업데이트', description: '사용자 프로필 정보를 업데이트합니다.' })
  @ApiQuery({ name: 'userId', description: '사용자 ID' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: '프로필 업데이트 성공', type: UserResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async updateProfile(
    @Query('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    try {
      const updatedUser = await this.authUsecase.updateProfile(parseInt(userId), updateProfileDto);
      return { user: updatedUser };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('request-password-reset')
  @ApiOperation({ summary: '비밀번호 재설정 요청', description: '비밀번호 재설정 이메일을 요청합니다.' })
  @ApiQuery({ name: 'email', description: '사용자 이메일' })
  @ApiResponse({ status: 200, description: '비밀번호 재설정 요청 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async requestPasswordReset(@Query('email') email: string): Promise<SuccessResponseDto> {
    try {
      await this.authUsecase.requestPasswordReset(email);
      return { success: true, message: '비밀번호 재설정 이메일이 발송되었습니다.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('reset-password')
  @ApiOperation({ summary: '비밀번호 재설정', description: '토큰을 사용하여 비밀번호를 재설정합니다.' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: '비밀번호 재설정 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<SuccessResponseDto> {
    try {
      await this.authUsecase.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
      return { success: true, message: '비밀번호가 재설정되었습니다.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
