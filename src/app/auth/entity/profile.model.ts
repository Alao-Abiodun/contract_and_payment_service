import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'profile' })
export class Profile {
  @PrimaryColumn({ name: 'id' })
  id: number;

  @Unique('profile_uuid_unique', ['uuid'])
  @Column({ name: 'uuid' })
  uuid: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'phone' })
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'profession' })
  profession: string;

  @Column({ name: 'balance' })
  balance: number;

  @Column({ name: 'role' })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
