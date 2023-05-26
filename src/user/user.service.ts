import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/user.dto';
import { hash } from 'bcrypt';
import { UtilsProvider } from 'src/utils/utils.provider';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly utilsProvider: UtilsProvider,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  findUserById(id: number): Promise<UserEntity> {
    return this.usersRepository.findOneBy({ id });
  }

  findAllByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOneBy({ email });
  }

  async createUser(body: CreateUserDto): Promise<UserEntity> {
    const data: CreateUserDto = { ...body };
    data.password = await hash(data.password, Number(process.env.HASH_ROUNDS));
    const result: UserEntity = this.usersRepository.create(data);
    return this.usersRepository.save(result);
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) throw new NotFoundException('User not found');
      user.password = await hash(newPassword, Number(process.env.HASH_ROUNDS));
      await this.usersRepository.save(user);
    } catch (error) {
      await this.utilsProvider.errorLogger(
        error,
        'updatePassword',
        'user.service.ts',
      );
      throw new InternalServerErrorException();
    }
  }
}
