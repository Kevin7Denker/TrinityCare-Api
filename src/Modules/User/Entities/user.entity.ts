import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Admin,
} from 'typeorm';
import { Doctor } from '../../Doctors/Entities/doctor.entity';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column({ default: false })
  is_email_verified: boolean;

  @Column({ nullable: true })
  email_verification_token: string;

  @Column({ type: 'timestamp', nullable: true })
  email_verification_expires: Date;

  @OneToMany(() => Doctor, (doctor) => doctor.user)
  doctors: Doctor[];
}
