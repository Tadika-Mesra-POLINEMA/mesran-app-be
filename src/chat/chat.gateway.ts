// chat.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageDto } from './dto/message.dto';
import { ChatValidator } from './chat.validator';
import { ValidationService } from '../common/validation.service';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private users: number = 0;

  constructor(
    private chatService: ChatService,
    private validatorService: ValidationService,
  ) {}

  afterInit(server: Server) {
    console.log('Socket server initialized');
  }

  handleConnection(client: Socket) {
    this.users++;
    console.log(`User connected: ${client.id}. Total users: ${this.users}`);
    this.server.emit('users', { count: this.users });
  }

  handleDisconnect(client: Socket) {
    this.users--;
    console.log(`User disconnected: ${client.id}. Total users: ${this.users}`);
    this.server.emit('users', { count: this.users });
  }

  @SubscribeMessage('message')
  async handleSendMessage(client: Socket, @MessageBody() message: MessageDto) {
    try {
      const validatedChat = this.validatorService.validate(
        ChatValidator.STORE_MESSAGE,
        message,
      );

      await this.chatService.store(validatedChat);

      client.emit('message_reply', {
        status: 'success',
        data: validatedChat,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Validation Error:', error);
      client.emit('message_reply', {
        status: 'error',
        error: 'Pesan tidak valid. Silakan coba lagi.',
        details: error.message,
      });
    }
  }
}
