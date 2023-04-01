import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Injectable()
export class LoginCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('before');
    console.log(context);
    // ...
    return next.handle().pipe(
      map((data) => {
        const http = context.switchToHttp();
        const res = http.getResponse();
        return data;
      }),
    );
  }
}
