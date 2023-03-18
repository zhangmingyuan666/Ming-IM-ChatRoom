import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as crypto from 'crypto';
import sequelize, { models } from 'src/database/sequelize';
import * as Sequelize from 'sequelize'; // 引入 Sequelize 库
import { sortString } from 'src/utils/handleMeeting';
import { createTimeStamp } from 'src/utils/time';

@Injectable()
export class MeetingService {
  // 获取Id
  async getMettingId(fromId: string, toId: string): Promise<any> {
    const [idFirst, idSecond] = sortString(fromId, toId);
    // 根据这两个id进行查询
    const sql = `
    SELECT
      *
    FROM
      meeting
    WHERE
      meeting_person_id_1 = '${idFirst}' AND meeting_person_id_2 = '${idSecond}'  
    `;

    try {
      const ans = await sequelize.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
        raw: true,
        logging: false,
      });

      const currentMeetingInfo = ans[0];
      if (currentMeetingInfo) {
        return {
          code: 200,
          data: {
            ...currentMeetingInfo,
            msg: '获取当前会议信息成功',
          },
        };
      } else {
        // 如果没有的话，插入新的行
        await this.createMeeting(idFirst, idSecond);
        // 插入成功后，获取当前信息
        return await this.getMettingId(idFirst, idSecond);
      }
    } catch (error) {
      return {
        code: 503,
        data: {
          msg: `Service error: ${error}`,
        },
      };
    }
  }

  // 创建会议
  async createMeeting(firstId: string, secondId: string) {
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const sql = `
    INSERT INTO meeting
    (meeting_person_id_1, meeting_person_id_2, meeting_id, create_timestamp)
      VALUES
    ('${firstId}', '${secondId}', '${crypto.randomUUID()}', '${timestamp}')
    `;

    try {
      await sequelize.query(sql);

      return {
        code: 200,
        data: {
          msg: '新建课程成功',
        },
      };
    } catch (err) {
      return {
        code: 500,
        data: {
          msg: '新建课程失败',
        },
      };
    }
  }

  // 在会议中发送消息
  async sendMessageInMeeting(
    meetingId: string,
    userId: string,
    receiverUserId: string,
    msg: string,
  ) {
    const timestamp = createTimeStamp();
    const messageId = crypto.randomUUID();

    const sql = `
    INSERT INTO 
      meeting_message
    (meeting_id, sender_id, message_id, create_timestamp, msg, is_msg_read, receiver_id)
      VALUES
    ('${meetingId}', '${userId}', '${messageId}', '${timestamp}', '${msg}', '0', '${receiverUserId}')
    `;

    try {
      await sequelize.query(sql);

      return {
        code: 200,
        data: {
          msg: '发送聊天消息成功',
          messageId,
        },
      };
    } catch (err) {
      return {
        code: 500,
        data: {
          msg: '发送聊天消息失败',
        },
      };
    }
  }

  // 在会议中接受消息
  // async receiverMessageInMeeting(meetingId: string) {}

  // 获取过往的消息记录Id
  async getMeetingHistory(meetingId: string) {
    const sql = `
    SELECT
      *
    FROM
      meeting_message
    WHERE
      meeting_id = '${meetingId}' 
    ORDER BY 
      create_timestamp
    `;

    try {
      const ans = await sequelize.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
        raw: true,
        logging: false,
      });

      return {
        data: {
          list: ans,
          msg: 'Success',
        },
        code: 200,
      };
    } catch (error) {
      return {
        code: 500,
        data: {
          msg: '获取聊天记录失败',
        },
      };
    }
  }

  async getOneMeetingMessage(message_id: string) {
    const ans = await models.meeting_message.findOne({
      where: {
        message_id,
      },
    });

    return ans.dataValues;
  }
}
