import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [MailModule, JwtModule],
})
export class UserModule {}
