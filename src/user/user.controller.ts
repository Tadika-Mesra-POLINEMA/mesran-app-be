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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';

// Services
import { UserService } from './user.service';

// Entities
import { UserProfile } from './entities/user-profile.entity';

// Dtos
import { AuthenticatedRequest, WebResponse } from 'src/app.dto';
import {
  RegisterUserRequest,
  RegisterUserResponse,
} from 'src/user/dto/register-user.dto';
import { UpdateUserRequest } from 'src/user/dto/update-user.dto';
import { UpdateProfileUserRequest } from 'src/user/dto/update-user-profile.dto';

// Guards
import { AuthGuard } from 'src/auth/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { InvariantException } from '../common/exceptions/invariant.exception';

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

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'faces', maxCount: 10 }]))
  @UseGuards(AuthGuard)
  @Post('faces')
  async registerFace(
    @Request() request: AuthenticatedRequest,
    @UploadedFiles() files: { faces?: Express.Multer.File[] },
  ): Promise<WebResponse<null>> {
    if (!files || !files.faces || files.faces.length == 0) {
      throw new InvariantException('Tidak ada file gambar yang diunggah');
    }

    const userId: string = request.user.id;

    await this.userService.registerFaces(userId, files.faces);

    return {
      status: 'success',
      message: 'Successfully registered user faces',
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
