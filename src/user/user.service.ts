import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  findAllByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOneBy({ email });
  }

  async createUser(body: CreateUserDto): Promise<UserEntity> {
    const data: CreateUserDto = { ...body };
    data.password = await hash(data.password, Number(10));
    const result: UserEntity = this.usersRepository.create(data);
    return this.usersRepository.save(result);
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    user.password = await hash(newPassword, Number(10));
    await this.usersRepository.save(user);
  }
}
