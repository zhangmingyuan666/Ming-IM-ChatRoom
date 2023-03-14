import { Module } from '@nestjs/common';
import { MeetingModule } from '../meeting/meeting.module';
import { UserModule } from '../user/user.module';
import { SocketService } from './socket.service';

@Module({
  imports: [UserModule, MeetingModule],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
