import { SessionEntity } from 'src/auth/auth.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'User' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];
}
