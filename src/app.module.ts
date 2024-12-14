import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { MailModule } from './mail/mail.module';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [UserModule, CommonModule, MailModule, AuthModule, EventModule],
})
export class AppModule {}
