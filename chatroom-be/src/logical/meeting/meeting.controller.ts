import { Body, Controller, Get, Post } from '@nestjs/common';
import { MeetingService } from './meeting.service';

@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Get()
  a() {
    console.log('a');
  }

  // 获取当前会议Id
  @Post('getMeetingId')
  async getMeetingId(@Body() body: any) {
    return await this.meetingService.getMettingId(
      body.personIdFirst,
      body.personIdSecond,
    );
  }
}
