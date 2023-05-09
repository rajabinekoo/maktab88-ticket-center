import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { SessionEntity } from './auth.entity';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(private readonly sessionService: AuthService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const token: string | undefined = req.headers?.authorization?.replace(
      'Bearer ',
      '',
    );
    if (!token) throw new UnauthorizedException();
    const session: SessionEntity = await this.sessionService.findSessionByToken(
      token,
    );
    if (!session) throw new UnauthorizedException();
    if (Number(session.expireTime) < this.sessionService.formatExpireTime()) {
      await this.sessionService.removeSession(session);
      throw new UnauthorizedException();
    }
    req.res.locals.session = session;

    next();
  }
}
