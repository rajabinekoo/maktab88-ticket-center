import { Entity, Column } from 'typeorm';

@Entity({ name: 'Sessions' })
export class SessionEntity {
  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  token: string;

  @Column({ nullable: true, default: Date.now() })
  expireTime: number; // unix timestamp
}
