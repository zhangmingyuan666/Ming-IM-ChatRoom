import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from '../../utils/cryptogram';
import { USER_STATUS } from 'src/constants/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // JWT2-校验用户信息
  async validateUser(username: string, password: string): Promise<any> {
    console.log('JWT-Step2:校验用户信息');
    const user = await this.userService.findOne(username);

    if (user) {
      const hashedPassword = user.password;
      const salt = user.password_salt;

      const hashPassword = encryptPassword(password, salt);
      if (hashPassword === hashedPassword) {
        return {
          code: 1,
          user,
        };
      } else {
        // 密码错误
        return {
          code: 2,
          user: null,
        };
      }
    }

    // 查无此人
    return {
      code: 3,
      user: null,
    };
  }

  // JWT验证：step3:处理jwt签证

  async certificate(user: any) {
    const payload = {
      username: user.username,
      sub: user._id,
    };
    console.log('JWT验证 - Step 3: 处理 jwt 签证');

    try {
      const token = this.jwtService.sign(payload);
      // await this.userService.updateUserInfoByUserId(user._id, USER_STATUS.live);
      return {
        code: 200,
        data: {
          token,
          userId: user._id,
          username: user.username,
          msg: `登录成功`,
        },
      };
    } catch (error) {
      return {
        code: 600,
        data: {
          msg: `账号或密码错误`,
        },
      };
    }
  }
}
