import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ValidationPipe } from 'src/pipe/validation/validation.pipe';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('find-one')
  findOne(@Body() body: any) {
    return this.userService.findOne(body.username);
  }

  @Get('find-all')
  findAll(@Query() query: any) {
    return this.userService.findAllUser(query.userId);
  }

  //@UseGuards(AuthGuard('jwt')) // 使用 'JWT' 进行验证
  @UsePipes(new ValidationPipe()) // 使用管道验证参数
  @Post('register')
  async register(@Body() body: RegisterUserDTO) {
    return await this.userService.register(body);
  }

  @UsePipes(new ValidationPipe()) // 使用管道验证参数
  @Post('login')
  async login(@Body() loginParams: LoginUserDTO) {
    console.log('JWT-Step1:验证用户登陆状态');

    const authResult = await this.authService.validateUser(
      loginParams.username,
      loginParams.password,
    );

    switch (authResult.code) {
      case 1:
        return this.authService.certificate(authResult.user);
      case 2:
        return {
          code: 600,
          msg: `账号或密码不正确`,
        };
      default:
        return {
          code: 600,
          msg: `查无此人`,
        };
    }
  }
}
