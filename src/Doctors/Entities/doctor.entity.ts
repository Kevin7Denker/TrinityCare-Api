import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../User/Entities/user.entity';

@Entity('Doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.doctors, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  specialty: string;

  @Column()
  medicalLicenseNumber: string;
}
