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

  @OneToMany(() => Doctor, (doctor) => doctor.user)
  doctors: Doctor[];
}
