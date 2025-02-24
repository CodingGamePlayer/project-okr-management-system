import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '사용자 생성', description: '새로운 사용자를 생성합니다.' })
  @ApiResponse({ status: 201, description: '사용자가 성공적으로 생성됨', type: CreateUserDto })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 409, description: '이미 존재하는 사용자' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '사용자 목록 조회', description: '모든 사용자 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '사용자 목록 조회 성공', type: [CreateUserDto] })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '사용자 상세 조회', description: '특정 사용자의 상세 정보를 조회합니다.' })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({ status: 200, description: '사용자 조회 성공', type: CreateUserDto })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '사용자 정보 수정', description: '특정 사용자의 정보를 수정합니다.' })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({ status: 200, description: '사용자 정보 수정 성공', type: UpdateUserDto })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '사용자 삭제', description: '특정 사용자를 삭제합니다.' })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({ status: 204, description: '사용자 삭제 성공' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: '이메일 인증', description: '사용자의 이메일을 인증합니다.' })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({ status: 200, description: '이메일 인증 성공', type: CreateUserDto })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  verifyEmail(@Param('id') id: string) {
    return this.userService.verifyEmail(+id);
  }

  @Post(':userId/roles/:roleId')
  @ApiOperation({ summary: '역할 할당', description: '사용자에게 역할을 할당합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiParam({ name: 'roleId', description: '역할 ID' })
  @ApiResponse({ status: 200, description: '역할 할당 성공', type: CreateUserDto })
  @ApiResponse({ status: 404, description: '사용자 또는 역할을 찾을 수 없음' })
  assignRole(@Param('userId') userId: string, @Param('roleId') roleId: string) {
    return this.userService.assignRole(+userId, +roleId);
  }
}
