import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

// Services
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { MailService } from 'src/mail/mail.service';
import { OtpService } from 'src/common/otp.service';
import { JwtService } from '@nestjs/jwt';

// Dtos
import { LoginRequest, LoginResponse } from 'src/auth/dto/login.dto';
import {
  VerifyLoginRequest,
  VerifyLoginResponse,
} from 'src/auth/dto/verify-login.dto';
import { RefreshRequest, RefreshResponse } from 'src/auth/dto/renew-token.dto';
import { LogoutRequest } from 'src/auth/dto/logout.dto';

// Models
import { OTP } from 'src/auth/entities/otp.entity';

// Validators
import { AuthValidator } from 'src/auth/auth.validator';

// Exceptions
import { InvariantException } from 'src/common/exception/invariant.exception';
import { AuthenticationException } from 'src/common/exception/authentication.exception';
import { NotfoundException } from 'src/common/exception/notfound.exception';

// Models
import { User } from '@prisma/client';
import { v4 as uuid } from 'uuid';

// Utils
import { comparePassword } from 'src/common/utils/compare-password';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private mailService: MailService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  /**
   * Method to login user
   *
   * @param request Payload to login
   * @returns Login response included verification key and OTP
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    this.logger.info(`Logged in user ${JSON.stringify(request)}`);

    const loginRequest = this.validationService.validate(
      AuthValidator.LOGIN,
      request,
    );

    if (!loginRequest.email && !loginRequest.phone) {
      throw new InvariantException('You need to put email or phone number');
    }

    const user: User = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email: loginRequest.email }, { phone: loginRequest.phone }],
      },
    });

    if (!user) {
      throw new AuthenticationException('Credentials not match.');
    }

    const isPasswordMatched = await comparePassword(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new AuthenticationException('Credentials not match.');
    }

    const otp = this.otpService.generate(6);
    const otpKey = uuid();

    await this.cacheManager.set(
      otpKey,
      JSON.stringify({
        userId: user.id,
        code: otp,
      }),
      3600000,
    );

    if (loginRequest.email) {
      // TODO: SEND EMAIL
      // await this.mailService.sendMail({
      //   to: user.email,
      //   subject: 'OTP Verification',
      //   template: 'otp',
      //   context: { otp },
      // });
    } else if (loginRequest.phone) {
      // TODO: SEND SMS VERIFICATION
    }

    return {
      verificationKey: otpKey,
      otp,
    };
  }

  /**
   * Method to verify OTP
   *
   * @param request Payload to verify OTP
   * @returns Login response included email, access token, and refresh token
   */
  async verifyOtp(request: VerifyLoginRequest): Promise<VerifyLoginResponse> {
    this.logger.info(`Verifying OTP ${JSON.stringify(request)}`);

    const verifyRequest: VerifyLoginRequest = this.validationService.validate(
      AuthValidator.VERIFY_LOGIN,
      request,
    );

    const cachedOtp: string = await this.cacheManager.get(
      verifyRequest.verificationKey,
    );

    if (!cachedOtp) {
      throw new AuthenticationException('OTP is expired.');
    }

    const otp: OTP = JSON.parse(cachedOtp);

    if (otp.code !== verifyRequest.otp) {
      throw new AuthenticationException('OTP is not match.');
    }

    const user: User = await this.prismaService.user
      .findUnique({
        where: {
          id: otp.userId,
        },
      })
      .catch(() => {
        throw new AuthenticationException('User not found.');
      });

    const accessToken: string = this.jwtService.sign(
      { id: user.id },
      { expiresIn: '1h' },
    );
    const refreshToken: string = this.jwtService.sign(
      { id: user.id },
      { expiresIn: '7d' },
    );

    await this.prismaService.authentication.create({
      data: {
        token: refreshToken,
      },
    });

    return {
      email: user.email,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Method to refresh token
   *
   * @param request Payload to refresh token
   * @returns Refresh response included access token
   */
  async refresh(request: RefreshRequest): Promise<RefreshResponse> {
    this.logger.info(`Refreshing token ${JSON.stringify(request)}`);

    const verifyRequest: RefreshRequest = this.validationService.validate(
      AuthValidator.REFRESH,
      request,
    );

    const refreshToken = await this.prismaService.authentication.findUnique({
      where: {
        token: verifyRequest.refreshToken,
      },
    });

    if (!refreshToken) {
      throw new NotfoundException('Token not found');
    }

    const user: User = await this.prismaService.user.findUnique({
      where: {
        id: this.jwtService.decode(refreshToken.token).id,
      },
    });

    if (!user) {
      throw new AuthenticationException('User not found.');
    }

    const accessToken: string = this.jwtService.sign(
      { id: user.id },
      { expiresIn: '1h' },
    );

    return {
      accessToken,
    };
  }

  /**
   * Method to logout user
   *
   * @param request Payload to logout
   */
  async logout(request: LogoutRequest): Promise<void> {
    this.logger.info(`Logging out user ${JSON.stringify(request)}`);

    const logoutRequest = this.validationService.validate(
      AuthValidator.LOGOUT,
      request,
    );

    await this.prismaService.authentication
      .delete({
        where: {
          token: logoutRequest.refreshToken,
        },
      })
      .catch(() => {
        throw new NotfoundException('Token not found');
      });
  }
}
