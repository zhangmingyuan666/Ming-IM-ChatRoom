import { Injectable } from '@nestjs/common';
import sequelize, { models } from 'src/database/sequelize';
import { MeetingService } from '../meeting/meeting.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SocketService {
  constructor(
    private readonly meetingService: MeetingService,
    private readonly userService: UserService,
  ) {}

  // findSocketByUserId:根据SocketId找userId;
  async findSocketByUserId(socketId: string, userId: string) {}

  // findUserIdBySocketId:根据SocketId找userId;
  async findUserIdBySocketId(socketId: string) {
    try {
      const { dataValues } = await models.user.findOne({
        where: {
          socket_id: socketId,
        },
      });
      return dataValues._id;
    } catch (err) {
      return false;
    }
  }

  // 将userId的socketId更改
  async updateSocketId(socketId: string, userId: string) {
    try {
      await models.user.update(
        {
          socket_id: socketId,
        },
        {
          where: {
            _id: userId,
          },
        },
      );
      return {
        code: 200,
        data: {
          msg: '更新socket_id成功',
        },
      };
    } catch (error) {
      return {
        code: 500,
        data: {
          msg: '更新socket_id失败',
        },
      };
    }
  }

  // loginWithSocketId
  // 当登录的时候，需要将socketId更新到对应用户的数据库中
  async loginWithSocketIdAndUserId(socketId: string, userId: string) {
    // const { dataValues } = await this.findSocketByUserId(socketId, userId);
    await this.userService.updateUserInfoByUserId(userId, 1);
    return await this.updateSocketId(socketId, userId);
  }

  // leaveWithSocketId
  // 当离开或者断开连接的时候，需要处理
  async leaveWithSocketId(socketId: string) {
    const userId = await this.findUserIdBySocketId(socketId);
    if (!userId) {
      return;
    }
    await this.userService.updateUserInfoByUserId(userId, 0);
  }
}
