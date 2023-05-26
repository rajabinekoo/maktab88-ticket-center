import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from 'src/user/user.entity';
import { IoRedisProvider } from './ioredis.provider';

@Injectable()
export class AuthService {
  constructor(private readonly redis: IoRedisProvider) {}

  public async createSession(token: string, user: UserEntity): Promise<void> {
    await this.redis.hset(token, user);
    await this.redis.expire(token, this.generateExpireTime());
  }

  public async generateToken(): Promise<string> {
    let token: string = uuidv4();
    let userId: string = await this.redis.hget(token, 'id');
    while (!!userId) {
      token = uuidv4();
      userId = await this.redis.hget(token, 'id');
    }
    return token;
  }

  public async removeSession(token: string): Promise<void> {
    await this.redis.hdel(token);
  }

  private generateExpireTime(): number {
    return Number(process.env.EXPIRE_MINUTES) * 60;
  }
}
