import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';

// Services
import { AuthService } from 'src/auth/auth.service';

// Types
import { WebResponse } from 'src/app.dto';

// Dtos
import { LoginRequest, LoginResponse } from 'src/auth/dto/login.dto';
import {
  VerifyLoginRequest,
  VerifyLoginResponse,
} from 'src/auth/dto/verify-login.dto';
import { RefreshRequest, RefreshResponse } from 'src/auth/dto/renew-token.dto';
import { LogoutRequest } from 'src/auth/dto/logout.dto';

@Controller('/api/authentications')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
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

  @Put('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() request: RefreshRequest,
  ): Promise<WebResponse<RefreshResponse>> {
    const response = await this.authService.refresh(request);

    return {
      status: 'success',
      message: 'Successfully renew access token',
      data: response,
    };
  }

  @Delete('/')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() request: LogoutRequest): Promise<WebResponse<null>> {
    await this.authService.logout(request);

    return {
      status: 'success',
      message: 'Successfully logout.',
    };
  }
}
