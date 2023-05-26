import { compare } from 'bcrypt';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  Post,
  UseInterceptors,
  NotAcceptableException,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { Request as RequestType } from 'express';
import { UserEntity } from './user.entity';
import { ResetPasswordInfoDto, UserDto } from './user.dto';
import {
  ApiBearerAuth,
  // ApiHeader,
  // ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// enum UserRole {
//   Admin = 'Admin',
//   Moderator = 'Moderator',
//   User = 'User',
// }

@Controller('user')
@ApiTags('user')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  // @ApiHeader({
  //   name: 'X-MyHeader',
  //   description: 'Custom header',
  // })
  // @ApiQuery({
  //   name: 'role',
  //   enum: UserRole,
  //   isArray: true,
  // })
  @ApiResponse({
    status: 200,
    description: 'Returns user information.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getProfile(@Req() req: RequestType): UserDto {
    const user: UserEntity = req.res.locals.user;
    return new UserDto(user);
  }

  @Post('/reset-password')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The password has been successfully changed.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async resetPassword(
    @Req() req: RequestType,
    @Body() resetInfo: ResetPasswordInfoDto,
  ) {
    const user: UserEntity = req.res.locals.user;
    const isValidCurrPass = await compare(
      resetInfo.currentPassword,
      user.password,
    );
    if (!isValidCurrPass) {
      throw new NotAcceptableException('current password is not valid');
    }
    await this.userService.updatePassword(user.id, resetInfo.newPassword);
  }
}
