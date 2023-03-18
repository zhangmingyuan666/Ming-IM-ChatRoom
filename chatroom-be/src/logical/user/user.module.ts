import { Module } from '@nestjs/common';
import { MeetingService } from '../meeting/meeting.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  //controllers: [UserController],
  providers: [UserService, MeetingService],
  exports: [UserService],
})
export class UserModule {}
