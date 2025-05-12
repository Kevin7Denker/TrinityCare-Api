import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Admin,
} from 'typeorm';
import { Doctor } from '../../Doctors/Entities/doctor.entity';
import { Patient } from 'src/Modules/Patients/Entities/patient.entity';

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

  @OneToMany(() => Patient, (patient) => patient.user)
  patients: Patient[];
}
