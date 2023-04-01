import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {AuthService} from '../auth/auth.service';
import {UserService} from './user.service';
import {AuthGuard} from '@nestjs/passport';
import {ValidationPipe} from 'src/pipe/validation/validation.pipe';
import {RegisterUserDTO} from './dto/register-user.dto';
import {LoginUserDTO} from './dto/login-user.dto';
import {CookieOptions, Request, Response} from 'express';
import {LoginCookieInterceptor} from './user.intercrptor';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getStatus(@Req() req: Request) {
    return {
      code: 200,
      data: {
        msg: '验证通过,jwt未过期',
      },
    }
  }

  @Post('find-one')
  findOne(@Body() body: any) {
    return this.userService.findOne(body.username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('find-all')
  findAll(@Query() query: any, @Req() req: Request) {
    //console.log('----------');
    //console.log(req.session);
    //console.log(req.cookies);
    return this.userService.findAllUser(query.userId);
  }

  // @UseGuards(AuthGuard('jwt')) // 使用 'JWT' 进行验证
  @UsePipes(new ValidationPipe()) // 使用管道验证参数
  @Post('register')
  async register(@Body() body: RegisterUserDTO, @Req() request: Request) {
    console.log(request.cookies);
    return await this.userService.register(body);
  }

  // @UseInterceptors(new LoginCookieInterceptor())
  @UsePipes(new ValidationPipe()) // 使用管道验证参数
  @Post('login')
  async login(@Body() loginParams: LoginUserDTO, @Res() res: Response, @Req() req: Request) {
    console.log('JWT-Step1:验证用户登陆状态');

    const authResult = await this.authService.validateUser(
      loginParams.username,
      loginParams.password,
    );

    switch (authResult.code) {
      case 1:
        const ans = await this.authService.certificate(authResult.user);
        // console.log(ans);
        const options: CookieOptions = {
          expires: new Date(Date.now() + 20 * 1000),
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          //domain: 'http://127.0.0.1:4396',
          //path: '/',
        };
        (req.session as any).authInfo = {
          user_id: ans.data.userId,
          username: ans.data.username,
          token: ans.data.token
        }
        res.cookie(
          'token',
          ans.data.token,
          options,
        );
        return res.send(ans);
      case 2:
        return res.send({
          code: 600,
          msg: `账号或密码不正确`,
        });
      default:
        return res.send({
          code: 600,
          msg: `查无此人`,
        });
    }
  }
}
