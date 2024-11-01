import { Body, Controller, Post } from '@nestjs/common';

// Services
import { UserService } from './user.service';

// Types
import {
  RegisterUserRequest,
  RegisterUserResponse,
} from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/')
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<RegisterUserResponse>> {
    const response = await this.userService.register(request);

    return {
      status: 'success',
      message: 'Successfully registered',
      data: response,
    };
  }
}
