import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  //circular dependencies check bc i cannot import AuthModule here (makes loop)
  imports: [TypeOrmModule.forFeature([UserEntity]), UtilsModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
