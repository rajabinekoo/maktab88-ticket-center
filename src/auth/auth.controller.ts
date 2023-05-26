import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  ForbiddenException,
  NotFoundException,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto, UserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/user.entity';
import { LoginInfoDto, LoginInfoResDto } from './auth.dto';
import { AuthService } from './auth.service';
import { compare } from 'bcrypt';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  async login(@Body() loginInfo: LoginInfoDto): Promise<LoginInfoResDto> {
    const user: UserEntity = await this.userService.findAllByEmail(
      loginInfo.email,
    );
    if (!user) throw new NotFoundException('User not found');
    if (!(await compare(loginInfo.password, user.password))) {
      throw new ForbiddenException();
    }
    const token: string = await this.authService.generateToken();
    await this.authService.createSession(token, user);
    return new LoginInfoResDto(user, token);
  }

  @Post('/registration')
  async registration(@Body() userData: CreateUserDto): Promise<UserDto> {
    const user: UserEntity = await this.userService.findAllByEmail(
      userData.email,
    );
    if (!!user) throw new ConflictException('User already exist');
    const newUser: UserEntity = await this.userService.createUser(userData);
    return new UserDto(newUser);
  }
}
