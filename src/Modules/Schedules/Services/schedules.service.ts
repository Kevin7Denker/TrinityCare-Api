import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateScheduleDto } from '../DTO/schedules.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async create(dto: CreateScheduleDto) {
    const { data, error } = await this.supabase
      .from('Schedules')
      .insert([dto])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findByDoctor(doctor_id: string) {
    const { data, error } = await this.supabase
      .from('Schedules')
      .select('*')
      .eq('doctor_id', doctor_id);

    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from('Schedules')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { message: 'Horário deletado com sucesso.' };
  }
}
