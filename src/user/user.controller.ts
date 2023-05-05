import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { Request as RequestType } from 'express';
import { UserEntity } from './user.entity';
import { UserDto } from './user.dto';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getProfile(@Req() req: RequestType): UserDto {
    const user: UserEntity = req.res.locals.user;
    return new UserDto(user);
  }
}
