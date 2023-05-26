import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from 'src/user/user.entity';
import { Redis } from 'ioredis';
import { ioredis } from './ioredis.service';

@Injectable()
export class AuthService {
  private readonly redis: Redis = ioredis;

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

  public formatExpireTime(date?: Date): number {
    return Math.floor((date || new Date()).getTime() / 1000);
  }

  public async removeSession(token: string): Promise<void> {
    await this.redis.hdel(token);
  }

  private generateExpireTime(): number {
    const date: Date = new Date();
    date.setMinutes(date.getMinutes() + Number(30));
    return this.formatExpireTime(date);
  }
}
