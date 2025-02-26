import { Injectable } from '@nestjs/common';
import { UserService } from 'src/domain/user/user.service';

@Injectable()
export class UserUsecase {
  constructor(private readonly userService: UserService) {}
}
