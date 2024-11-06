import { Module } from '@nestjs/common';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { MailModule } from './mail/mail.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true, ttl: 0 }),
    UserModule,
    CommonModule,
    MailModule,
    AuthModule,
    EventModule,
    ChatModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
