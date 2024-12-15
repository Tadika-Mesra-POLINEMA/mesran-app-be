import { Inject } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Server } from 'socket.io';
import { Logger } from 'winston';
import { JwtService } from '@nestjs/jwt';
import { NotificationData } from './dto/notification-data.dto';

@WebSocketGateway({
  port: 3002,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class NotificationGateway {
  private clientMap = new Map<string, string>(); // Map to store clientId and userId

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  // Handle client connection and store clientId with userId
  @SubscribeMessage('connect')
  handleConnection(client: any): void {
    const token = client.handshake.query.token;
    console.log(token);

    if (token) {
      try {
        const decoded = this.jwtService.verify(token) as { id: string };

        if (decoded) {
          this.clientMap.set(client.id, decoded.id);
          this.logger.info('Client connected', { clientId: client.id });
        } else {
          this.logger.error('Failed to decode token');
        }
      } catch (err) {
        this.logger.error('Failed to decode token', err);
      }
    }
  }

  sendBroadcastNotification(message: string): void {
    this.server.emit('notification', { message });
    this.logger.info('Broadcasting notification', { message });
  }

  sendNotificationToClient(userId: string, message: NotificationData): void {
    const clientId = [...this.clientMap.entries()].find(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, value]) => value === userId,
    )?.[0];

    if (clientId) {
      const clientSocket = this.server.sockets.sockets.get(clientId);
      if (clientSocket) {
        clientSocket.emit('notification', { message });
        this.logger.info('Sending notification to specific client', {
          userId,
          message,
        });
      }
    }
  }
}
