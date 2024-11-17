import {
  CanActivate,
  ExecutionContext,
  Global,
  Injectable,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthorizationException } from 'src/common/exceptions/authorization.exception';
import { NotfoundException } from 'src/common/exceptions/notfound.exception';
import { PrismaService } from 'src/common/prisma.service';

@Global()
@Injectable()
export class VerifyEventOwnerGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const eventId = request.params.eventId;
    const user = request.user;

    const event = await this.prismaService.event.findUnique({
      where: { id: eventId },
      select: { user_id: true },
    });

    if (!event) throw new NotfoundException('Event not found');

    if (event.user_id !== user.id)
      if (user.role !== Role.ADMIN)
        throw new AuthorizationException('You are not the owner of this event');

    return true;
  }
}
