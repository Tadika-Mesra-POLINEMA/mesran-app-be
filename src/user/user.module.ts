import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    MailModule,
    JwtModule.register({
      privateKey: process.env.TOKEN_SECRET,
    }),
    HttpModule.register({
      baseURL: process.env.MACHINE_LEARNING_BASE_URL,
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
})
export class UserModule {}
