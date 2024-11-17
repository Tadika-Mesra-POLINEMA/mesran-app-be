import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { User } from '@prisma/client';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';

// Services
import { PrismaService } from 'src/common/prisma.service';

// Entities
import { UserProfile } from 'src/user/entities/user-profile.entity';

// Dtos
import {
  RegisterUserRequest,
  RegisterUserResponse,
} from 'src/user/dto/register-user.dto';
import { UpdateUserRequest } from 'src/user/dto/update-user.dto';
import { UpdateProfileUserRequest } from 'src/user/dto/update-user-profile.dto';

// Validators
import { ValidationService } from 'src/common/validation.service';
import { UserValidator } from 'src/user/user.validator';

// Exceptions
import { NotfoundException } from 'src/common/exceptions/notfound.exception';
import { InvariantException } from 'src/common/exceptions/invariant.exception';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  /**
   * Method to register user
   *
   * @param request Payload to register user included email, phone, password
   * @returns Registered user response
   */
  async register(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    this.logger.info(`Register new user ${JSON.stringify(request)}`);

    const registerRequest: RegisterUserRequest =
      await this.validationService.validate(UserValidator.REGISTER, request);

    const isEmailUsed: boolean = !!(await this.prismaService.user.count({
      where: {
        email: registerRequest.email,
      },
    }));

    if (isEmailUsed) {
      throw new HttpException('Email already exists', 400);
    }

    const isPhoneNumberUsed: boolean = !!(await this.prismaService.user.count({
      where: {
        phone: registerRequest.phone,
      },
    }));

    if (isPhoneNumberUsed) {
      throw new HttpException('Phone number already used', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const registeredUser = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      email: registeredUser.email,
      userId: registeredUser.id,
    };
  }

  /**
   * Method to add profile
   *
   * @param request Payload to add profile included username, firstname, lastname
   * @param userId User id
   * @returns Response of added profile
   */
  async addProfile(request: UserProfile, userId: string): Promise<UserProfile> {
    this.logger.info(`Add profile for user ${JSON.stringify(request)}`);

    const profileRequest: UserProfile = await this.validationService.validate(
      UserValidator.PROFILE,
      request,
    );

    const existingProfile = await this.prismaService.profile.findUnique({
      where: { user_id: userId },
    });

    if (existingProfile) {
      throw new InvariantException('Profile already exists');
    }

    return await this.prismaService.profile.create({
      data: {
        username: profileRequest.username,
        firstname: profileRequest.firstname,
        lastname: profileRequest.lastname,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  /**
   * Method to get user
   *
   * @param userId User id
   * @returns User profile
   */
  async getUser(userId: string): Promise<Omit<User, 'password'>> {
    this.logger.info(`Get user profile ${userId}`);

    return await this.prismaService.user
      .findUnique({
        where: {
          id: userId,
        },
        include: {
          profile: true,
        },
      })
      .then((user) => {
        delete user.password;
        return user;
      })
      .catch(() => {
        throw new NotfoundException('User not found');
      });
  }

  /**
   * Method to update user
   *
   * @param request Payload to update user included phone
   * @param userId User id
   */
  async updateUser(request: UpdateUserRequest, userId: string): Promise<void> {
    this.logger.info(`Update user profile ${JSON.stringify(request)}`);

    const updateRequest = this.validationService.validate(
      UserValidator.UPDATE_USER,
      request,
    );

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        phone: updateRequest.phone,
      },
    });
  }

  /**
   * Method to update profile
   *
   * @param request Payload to update profile included username, firstname, lastname
   * @param userId User id
   */
  async updateProfile(
    request: UpdateProfileUserRequest,
    userId: string,
  ): Promise<void> {
    this.logger.info(`Update profile ${JSON.stringify(request)}`);

    const updateRequest = this.validationService.validate(
      UserValidator.UPDATE_PROFILE,
      request,
    );

    await this.prismaService.profile.update({
      where: {
        user_id: userId,
      },
      data: updateRequest,
    });
  }
}
