import { Injectable } from '@nestjs/common';
import * as otpGenerator from 'otp-generator';

@Injectable()
export class OtpService {
  generate(
    length: number,
    options: OtpConfig = {
      isDigits: true,
      isAlphabets: false,
      isUpperCase: false,
      isSpecialChars: false,
    },
  ): string {
    return otpGenerator.generate(length, {
      digits: options.isDigits,
      alphabets: options.isAlphabets,
      upperCase: options.isUpperCase,
      specialChars: options.isSpecialChars,
    });
  }
}

interface OtpConfig {
  isDigits: boolean;
  isAlphabets: boolean;
  isUpperCase: boolean;
  isSpecialChars: boolean;
}
