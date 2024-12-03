import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// Services
import { PrismaService } from 'src/common/prisma.service';

// DTOs
import { MessageDto } from './dto/message.dto';
import {
  CreateChatRoomDto,
  CreateChatRoomResponseDto,
} from './dto/chat-room.dto';

@Injectable()
export class ChatService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  /**
   * Storing the message
   *
   * @param message Parameter to store the message
   */
  async store(message: MessageDto): Promise<void> {
    this.logger.info(`Storing a new message in chatroom ${message.chatId}`);

    await this.prismaService.message.create({
      data: {
        content: message.content,
        chatroom: {
          connect: {
            id: message.chatId,
          },
        },
        user: {
          connect: {
            id: message.userId,
          },
        },
      },
    });

    this.logger.info(`Message stored in chatroom ${message.chatId}`);
  }
}
