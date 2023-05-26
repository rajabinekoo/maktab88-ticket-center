import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserDto } from 'src/user/user.dto';
import { UserEntity } from 'src/user/user.entity';

export class LoginInfoDto {
  @ApiProperty({
    required: true,
    example: 'test234442@test.com',
    description: 'Valid signed up email.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, example: 'testtesttest' })
  @IsNotEmpty()
  password: string;
}

export class LoginInfoResDto {
  @Type(() => UserDto)
  user: UserDto = new UserDto({});

  token: string;

  constructor(partial: Partial<UserEntity>, token: string) {
    Object.assign(this.user, partial);
    this.token = token;
  }
}
