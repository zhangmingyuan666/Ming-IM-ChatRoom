import { Injectable } from '@nestjs/common';
import * as Sequelize from 'sequelize'; // 引入 Sequelize 库
import { encryptPassword, makeSalt } from 'src/utils/cryptogram';
import sequelize, { models } from '../../database/sequelize'; // 引入 Sequelize 实例
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  async findOne(username: string): Promise<any> {
    try {
      const { dataValues: ans } = await models.user.findOne({
        where: {
          username,
        },
      });
      return ans;
    } catch (error) {
      console.log(error);
      return void 0;
    }
  }

  async findOneByUserId(userId: string): Promise<any> {
    const sql = `
    SELECT
      *
    FROM
      user
    WHERE
      _id = '${userId}'
  `; // 一段平淡无奇的 SQL 查询语句

    try {
      const user = (
        await sequelize.query(sql, {
          type: Sequelize.QueryTypes.SELECT,
          raw: true,
          logging: false,
        })
      )[0];

      return user;
    } catch (error) {
      console.log(error);
      return void 0;
    }
  }

  async findAllUser(userId: string): Promise<any> {
    const sql = `
    SELECT
      *
    FROM
      user
    WHERE
      _id != '${userId}'
  `; // 一段平淡无奇的 SQL 查询语句

    try {
      const user = await sequelize.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
        raw: true,
        logging: false,
      });

      return user;
    } catch (error) {
      console.log(error);
      return void 0;
    }
  }

  async updateUserInfoByUserId(
    userId: string,
    user_status: 0 | 1 | 2,
  ): Promise<any> {
    const sql = `
    UPDATE
      user
    SET
      user_status = '${user_status}'
    WHERE
      _id = '${userId}'
      `;

    try {
      await sequelize.query(sql, {
        logging: false,
      });

      return {
        code: 200,
        data: {
          msg: '切换状态成功',
        },
      };
    } catch (error) {
      return {
        code: 503,
        data: {
          msg: `Service error: ${error}`,
        },
      };
    }
  }

  async register(requestBody: any): Promise<any> {
    const { username, password } = requestBody;

    const user = await this.findOne(username);

    if (user) {
      return {
        code: 400,
        data: {
          msg: '用户已经存在',
        },
      };
    }

    const salt = makeSalt();
    const hashPwd = encryptPassword(password, salt);
    const _id = crypto.randomUUID();
    const registerSQL = `
    INSERT INTO user
    (username, password, password_salt, _id, user_status)
      VALUES
    ('${username}', '${hashPwd}', '${salt}', '${_id}', 0)
    `;

    try {
      await sequelize.query(registerSQL, {
        logging: false,
      });
      return {
        code: 200,
        data: {
          msg: 'Success',
        },
      };
    } catch (error) {
      return {
        code: 503,
        data: {
          msg: `Service error: ${error}`,
        },
      };
    }
  }
}
