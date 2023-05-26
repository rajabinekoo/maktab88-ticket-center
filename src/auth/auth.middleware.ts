import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/user/user.service';
import { IoRedisProvider } from './ioredis.provider';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(
    private readonly userSerivce: UserService,
    private readonly redis: IoRedisProvider,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const token: string | undefined = req.headers?.authorization?.replace(
      'Bearer ',
      '',
    );
    if (!token) throw new UnauthorizedException();

    const id: string = await this.redis.hget(token, 'id');
    if (!id) throw new UnauthorizedException();

    const user = await this.userSerivce.findUserById(Number(id));
    if (!user) throw new UnauthorizedException();

    req.res.locals.user = user;

    next();
  }
}
