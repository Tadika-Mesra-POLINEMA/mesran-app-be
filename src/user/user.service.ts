import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { User } from '@prisma/client';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import * as FormData from 'form-data';

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
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private httpService: HttpService,
    private jwtService: JwtService,
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
      data: {
        email: registerRequest.email,
        phone: registerRequest.phone,
        password: registerRequest.password,
      },
    });

    const nameSplitted = registerRequest.name.split(' ');

    const generatedUsername = registeredUser.email.split('@')[0];
    const generatedFirstname = nameSplitted
      .filter((_, index) => index < 2)
      .map((name) => name)
      .join(' ');
    const generatedLastname = nameSplitted
      .filter((_, index) => index >= 2)
      .map((name) => name)
      .join(' ');

    await this.prismaService.profile.create({
      data: {
        username: generatedUsername,
        firstname: generatedFirstname,
        lastname: generatedLastname,
        user: {
          connect: {
            id: registeredUser.id,
          },
        },
      },
    });

    const accessToken: string = this.jwtService.sign(
      {
        id: registeredUser.id,
        role: registeredUser.role,
      },
      { expiresIn: '1h' },
    );

    const refreshToken: string = this.jwtService.sign(
      {
        id: registeredUser.id,
      },
      {
        expiresIn: '7d',
      },
    );

    await this.prismaService.authentication.create({
      data: {
        token: refreshToken,
      },
    });

    return {
      email: registeredUser.email,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Method to register user faces
   *
   * @param userId Id user to register the face
   * @param faces List of image used for registering user faces
   * @return Promise<void>
   */
  async registerFaces(
    userId: string,
    faces: Express.Multer.File[],
  ): Promise<void> {
    this.logger.info(`Register new user ${JSON.stringify(userId)}`);

    const isUserExist = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!isUserExist) {
      throw new NotfoundException('User not found');
    }

    const formData = new FormData();

    formData.append('user_id', userId);

    faces.forEach((face) => {
      formData.append('faces', face.buffer, {
        filename: face.originalname,
        contentType: face.mimetype,
      });
    });

    try {
      const response = await this.httpService.axiosRef.post(
        '/faces/register',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        },
      );

      console.log(response);
      this.logger.info(`Response status ${response.status}`);

      if (response.status === 201) {
        this.logger.info(
          `Update register face status into true user ${userId}`,
        );

        await this.prismaService.user.update({
          data: {
            is_face_registered: true,
          },
          where: {
            id: userId,
          },
        });

        this.logger.info('Photo successfully updated');
      } else {
        this.logger.info('Failed to register user face');
        throw new InvariantException('Failed to register user face');
      }
    } catch (error) {
      this.logger.error('Failed to register user face', error.message);
      throw new InvariantException(error.message);
    }
  }

  /**
   * Method to predict face
   *
   * @param face Image used for predicting user face
   * @returns Promise<void>
   */
  async predictFace(face: Express.Multer.File): Promise<User> {
    this.logger.info(`Predict face for user`);

    const formData = new FormData();

    formData.append('face', face.buffer, {
      filename: face.originalname,
      contentType: face.mimetype,
    });

    try {
      const response = await this.httpService.axiosRef.post(
        '/predict',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        },
      );

      this.logger.info(`Response status ${response.status}`);

      if (response.status === 200) {
        this.logger.info('Successfully predicted face');

        const confidenceVal = response.data.confidence;

        if (confidenceVal < 0.5)
          throw new InvariantException('Confidence value is less than 0.5');

        return await this.prismaService.user.findFirst({
          where: {
            id: response.data.user_id,
          },
          include: {
            profile: true,
          },
        });
      } else {
        this.logger.info('Failed to predict face');
        throw new InvariantException('Failed to predict face');
      }
    } catch (error) {
      this.logger.error('Failed to predict face', error.message);
      throw new InvariantException(error);
    }
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

    return this.prismaService.profile.create({
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
  async getUser(userId: string): Promise<User> {
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

    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidator.UPDATE_USER,
      request,
    );

    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user)
      throw new NotfoundException('Cannot update user, User not found');

    const isPasswordMatch = await bcrypt.compare(
      updateRequest.password_before,
      user.password,
    );

    if (!isPasswordMatch)
      throw new InvariantException(
        "Cannot update user, your password isn't match with your previous password",
      );

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        email: updateRequest.email,
        password: updateRequest.password,
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

    const updateRequest: UpdateProfileUserRequest =
      await this.validationService.validate(
        UserValidator.UPDATE_PROFILE,
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

    const nameSplitted = updateRequest.name.split(' ');
    const generatedFirstname = nameSplitted
      .filter((_, index) => index < 2)
      .map((name) => name)
      .join(' ');
    const generatedLastname = nameSplitted
      .filter((_, index) => index >= 2)
      .map((name) => name)
      .join(' ');

    await this.prismaService.profile.update({
      where: {
        user_id: userId,
      },
      data: {
        firstname: generatedFirstname,
        lastname: generatedLastname,
      },
    });
  }
}
