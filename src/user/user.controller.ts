import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';

// Services
import { UserService } from './user.service';

// Types
import {
  RegisterUserRequest,
  RegisterUserResponse,
  UpdateProfileUserRequest,
  UpdateUserRequest,
  UserProfile,
} from 'src/model/user.model';
import { AuthenticatedRequest, WebResponse } from 'src/model/web.model';

// Guards
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
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

  @UseGuards(AuthGuard)
  @Post('profile')
  @HttpCode(HttpStatus.OK)
  async createProfile(
    @Request() request: AuthenticatedRequest,
    @Body() body: UserProfile,
  ): Promise<WebResponse<UserProfile>> {
    const userId = request.user.id;

    const profile = await this.userService.addProfile(body, userId);

    return {
      status: 'success',
      message: 'Successfully added profile',
      data: profile,
    };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(
    @Request() request: AuthenticatedRequest,
  ): Promise<WebResponse<Omit<User, 'password'>>> {
    const userId = request.user.id;

    const user = await this.userService.getUser(userId);

    return {
      status: 'success',
      message: 'Successfully obtained user profile',
      data: user,
    };
  }

  @UseGuards(AuthGuard)
  @Put()
  @HttpCode(HttpStatus.OK)
  async update(
    @Request() request: AuthenticatedRequest,
    @Body() body: UpdateUserRequest,
  ): Promise<WebResponse<null>> {
    const userId = request.user.id;

    await this.userService.updateUser(body, userId);

    return {
      status: 'success',
      message: 'Successfully updated user information',
    };
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Request() request: AuthenticatedRequest,
    @Body() body: UpdateProfileUserRequest,
  ): Promise<WebResponse<null>> {
    const userId = request.user.id;

    await this.userService.updateProfile(body, userId);

    return {
      status: 'success',
      message: 'Successfully updated user profile',
    };
  }
}
