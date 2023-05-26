import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UserEntity } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    required: true,
    example: 'test234442@test.com',
    description: 'Valid signed up email.',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ required: true, example: 'testtesttest', minLength: 8 })
  password: string;
}

export class UserDto {
  id: number;
  email: string;
  isAdmin: boolean;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

export class ResetPasswordInfoDto {
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 'testtesttest' })
  currentPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ required: true, example: 'testtesttest', minLength: 8 })
  newPassword: string;
}
