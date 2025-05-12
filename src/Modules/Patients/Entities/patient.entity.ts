import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../User/Entities/user.entity';

@Entity('Patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
