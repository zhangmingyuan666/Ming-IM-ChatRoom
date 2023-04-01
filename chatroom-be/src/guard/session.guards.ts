// roles.guards.ts
import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common'
import {Observable} from 'rxjs'

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    console.log(req.path);

    if (req.path === '/user/login' || req.path === '/user') {
      return true
    }

    console.log(req.cookie);
    console.log('---------------------');
    console.log(req.session);

    if (req.session && req.session.authInfo) {
      console.log('---');
      console.log(req.session.authInfo);
      console.log('---');
      console.log('session正常需要续期');
      return true
    } else {
      console.log('session过期需要续期');
      return false
    }

    return true
  }
}