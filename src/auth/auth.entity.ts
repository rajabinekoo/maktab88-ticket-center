import { UserEntity } from 'src/user/user.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Sessions' })
export class SessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  token: string;

  @Column({ nullable: false })
  expireTime: string; // unix timestamp

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;
}
