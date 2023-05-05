import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SessionEntity } from './auth.entity';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
  ) {}

  public async findSessionByToken(token: string): Promise<SessionEntity> {
    return this.sessionRepository.findOne({
      relations: { user: true },
      where: { token },
    });
  }

  public async createSession(
    token: string,
    user: UserEntity,
  ): Promise<SessionEntity> {
    const newSession: SessionEntity = await this.sessionRepository.create({
      user,
      token,
      expireTime: String(this.generateExpireTime()),
    });
    return this.sessionRepository.save(newSession);
  }

  public async generateToken(): Promise<string> {
    let token: string = uuidv4();
    let targetSession: SessionEntity = await this.findSessionByToken(token);
    while (!!targetSession) {
      token = uuidv4();
      targetSession = await this.findSessionByToken(token);
    }
    return token;
  }

  public formatExpireTime(date?: Date): number {
    return Math.floor((date || new Date()).getTime() / 1000);
  }

  public async removeSession(session: SessionEntity): Promise<void> {
    await this.sessionRepository.delete({ id: session.id });
  }

  private generateExpireTime(): number {
    const date: Date = new Date();
    date.setMinutes(date.getMinutes() + Number(process.env.EXPIRE_MINUTES));
    return this.formatExpireTime(date);
  }
}
