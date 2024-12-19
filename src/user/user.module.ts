import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [UserController],
  imports: [
    MailModule,
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: '1h', algorithm: 'HS256' },
    }),
    HttpModule.register({
      baseURL: process.env.MACHINE_LEARNING_BASE_URL,
      maxRedirects: 5,
    }),
    NotificationModule,
  ],
  providers: [UserService],
})
export class UserModule {}
