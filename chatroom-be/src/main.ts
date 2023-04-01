import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as session from 'express-session';
import {HttpExceptionFilter} from './filter/http-exception/http-exception.filter';
import {SessionGuard} from './guard/session.guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cors({
      origin: 'http://127.0.0.1:4396',
      credentials: true,
    }),
  );

  app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 20 * 60 * 20 * 1000, signed: true},
  }));

  app.useGlobalGuards(new SessionGuard())

  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3050);
}
bootstrap();
