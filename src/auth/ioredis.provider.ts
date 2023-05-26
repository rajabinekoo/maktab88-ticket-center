import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class IoRedisProvider extends Redis {
  constructor() {
    super();
    this.checkConnection();
  }

  async checkConnection() {
    try {
      await this.ping();
      console.log('Connected');
    } catch (e) {
      console.log('error', e);
    }
  }
}
