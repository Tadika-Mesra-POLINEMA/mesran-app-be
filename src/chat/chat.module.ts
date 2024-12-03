import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatroomService } from './chatroom.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [ChatGateway, ChatService, ChatroomService],
  controllers: [ChatController],
  imports: [JwtModule],
})
export class ChatModule {}
