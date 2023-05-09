import { hash, compare } from 'bcrypt';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  Post,
  UseInterceptors,
  NotAcceptableException,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { Request as RequestType } from 'express';
import { UserEntity } from './user.entity';
import { ResetPasswordInfoDto, UserDto } from './user.dto';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getProfile(@Req() req: RequestType): UserDto {
    const user: UserEntity = req.res.locals.session.user;
    return new UserDto(user);
  }

  @Post('/reset-password')
  async resetPassword(
    @Req() req: RequestType,
    @Body() resetInfo: ResetPasswordInfoDto,
  ) {
    const user: UserEntity = req.res.locals.session.user;
    const isValidCurrPass = await compare(
      resetInfo.currentPassword,
      user.password,
    );
    if (!isValidCurrPass) {
      throw new NotAcceptableException('current password is not valid');
    }
    this.userService.updatePassword(user.id, resetInfo.newPassword);
  }
}
