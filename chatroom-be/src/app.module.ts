import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './logical/user/user.module';
import { AuthModule } from './logical/auth/auth.module';
import { UserController } from './logical/user/user.controller';
import { EventsGateway } from './events/events.gateway';
import { MeetingService } from './logical/meeting/meeting.service';
import { MeetingModule } from './logical/meeting/meeting.module';
import { MeetingController } from './logical/meeting/meeting.controller';
import { SocketModule } from './logical/socket/socket.module';
import { SocketController } from './logical/socket/socket.controller';

@Module({
  imports: [UserModule, AuthModule, MeetingModule, SocketModule],
  controllers: [AppController, UserController, MeetingController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
