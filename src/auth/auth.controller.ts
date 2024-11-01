import { Body, Controller, HttpCode, Post } from '@nestjs/common';

// Services
import { AuthService } from 'src/auth/auth.service';

// Types
import { WebResponse } from 'src/model/web.model';
import {
  LoginRequest,
  LoginResponse,
  VerifyLoginRequest,
  VerifyLoginResponse,
} from 'src/model/user.model';

@Controller('/api/authentications')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/')
  @HttpCode(200)
  async login(
    @Body() request: LoginRequest,
  ): Promise<WebResponse<LoginResponse>> {
    const response = await this.authService.login(request);

    return {
      status: 'success',
      message: 'Successfully logged in',
      data: response,
    };
  }

  @Post('/verify-login')
  @HttpCode(200)
  async verifyOtp(
    @Body() request: VerifyLoginRequest,
  ): Promise<WebResponse<VerifyLoginResponse>> {
    const response = await this.authService.verifyOtp(request);

    return {
      status: 'success',
      message: 'Successfully verified OTP',
      data: response,
    };
  }
}
