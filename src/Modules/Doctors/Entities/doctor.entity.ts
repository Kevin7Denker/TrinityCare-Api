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

  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  specialty: string;

  @Column()
  medicalLicenseNumber: string;
}
