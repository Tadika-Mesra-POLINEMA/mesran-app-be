import { Injectable } from '@nestjs/common';
import * as otpGenerator from 'otp-generator';

@Injectable()
export class OtpService {
  generate(length: number): string {
    return otpGenerator.generate(length, {
      // digits: true,
      // alphabets: false,
      // upperCase: false,
      // specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
  }
}
