import { IsUUID, IsInt, Min, Max, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsUUID()
  doctor_id: string;

  @IsInt()
  @Min(0)
  @Max(6)
  day_of_week: number;

  @IsString()
  start_time: string;
  @IsString()
  end_time: string;
}
