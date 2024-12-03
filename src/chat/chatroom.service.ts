import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';

// DTOs
import {
  CreateChatRoomDto,
  CreateChatRoomResponseDto,
} from './dto/chat-room.dto';
import { ChatRoom } from './entities/chatroom.entity';

@Injectable()
export class ChatroomService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  /**
   * Create a chat room
   *
   * @param isGroup Parameter to determine if the chat room is a group chat
   * @returns Created chat room ID
   */
  async createChatRoom({
    isGroup,
  }: CreateChatRoomDto): Promise<CreateChatRoomResponseDto> {
    this.logger.info('Creating chat room');

    const createdChatRoom = await this.prismaService.chatRoom.create({
      data: {
        is_group: isGroup,
      },
    });

    return {
      chatRoomId: createdChatRoom.id,
    };
  }

  /**
   * Get chat rooms by user
   *
   * @param isGroup Parameter to determine if the chat room is a group chat
   * @returns Chat rooms that the user is in
   */
  async getChatRoomsByUser(isGroup: boolean): Promise<ChatRoom[]> {
    this.logger.info('Getting chat rooms by user');

    const chatRooms = await this.prismaService.chatRoom.findMany({
      where: {
        is_group: isGroup,
      },
      include: {
        messages: {
          select: {
            content: true,
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
              },
            },
            created_at: true,
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
        },
      },
    });

    return chatRooms;
  }

  /**
   * Get chat room by ID
   *
   * @param chatRoomId ID of the chat room to retrieve
   * @returns The chat room with the specified ID
   */
  async getChatRoomDetailsById(chatRoomId: string): Promise<ChatRoom> {
    this.logger.info('Getting chat room details by ID');

    const chatRoom = await this.prismaService.chatRoom.findUnique({
      where: {
        id: chatRoomId,
      },
      include: {
        messages: {
          select: {
            content: true,
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
              },
            },
            created_at: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    return chatRoom;
  }
}
