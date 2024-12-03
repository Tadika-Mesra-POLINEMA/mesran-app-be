import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WebResponse } from 'src/app.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatService } from './chat.service';
import { ChatroomService } from './chatroom.service';
import { CreateChatRoomResponseDto } from './dto/chat-room.dto';

@Controller('api/chatroom')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private chatroomService: ChatroomService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @Post(':type')
  async createChatRoom(
    @Param('type') type: string,
  ): Promise<WebResponse<CreateChatRoomResponseDto>> {
    const isGroup = type === 'group';

    const createdChatroom = await this.chatroomService.createChatRoom({
      isGroup,
    });

    return {
      status: 'success',
      message: 'Chat room created successfully',
      data: createdChatroom,
    };
  }
}
