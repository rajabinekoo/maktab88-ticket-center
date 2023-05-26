import { Module, OnModuleInit } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { IoRedisProvider } from './ioredis.provider';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
  controllers: [AuthController],
  providers: [AuthService, IoRedisProvider],
  exports: [AuthService, IoRedisProvider],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly redis: IoRedisProvider) {}

  onModuleInit() {
    // return this.redis.checkConnection();
  }
}
