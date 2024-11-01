import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { UserValidator } from 'src/user/user.validator';
import {
  RegisterUserRequest,
  RegisterUserResponse,
} from 'src/model/user.model';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

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
    };
  }
}
