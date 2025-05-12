import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  patient_id: string;

  @Column({ nullable: true })
  doctor_id: string;

  @Column({ nullable: true })
  receptionist_id: string;

  @Column()
  scheduled_time: Date;

  @Column()
  status: 'agendada' | 'realizada' | 'cancelada';

  @Column({ nullable: true })
  notes?: string;
}
