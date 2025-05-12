import {
  IsUUID,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  patient_id: string;

  @IsUUID()
  @IsNotEmpty()
  doctor_id: string;

  @IsUUID()
  @IsOptional()
  receptionist_id?: string;

  @IsDateString()
  @IsNotEmpty()
  scheduled_time: string;

  @IsEnum(['agendada', 'realizada', 'cancelada'])
  @IsNotEmpty()
  status: 'agendada' | 'realizada' | 'cancelada';

  @IsOptional()
  notes?: string;
}
