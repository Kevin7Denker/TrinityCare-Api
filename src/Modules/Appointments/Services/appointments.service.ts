import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Inject } from '@nestjs/common';
import { CreateAppointmentDto } from '../DTO/appointments.dto';
import dayjs from 'dayjs';

@Injectable()
export class AppointmentService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async create(dto: CreateAppointmentDto) {
    const scheduledTime = dayjs(dto.scheduled_time);
    const dayOfWeek = scheduledTime.day();
    const time = scheduledTime.format('HH:mm');

    const { data: schedules, error } = await this.supabase
      .from('Schedules')
      .select('*')
      .eq('doctor_id', dto.doctor_id)
      .eq('day_of_week', dayOfWeek);

    if (error) throw new Error(error.message);

    const isValidTime = schedules.some((schedule) => {
      return time >= schedule.start_time && time <= schedule.end_time;
    });

    if (!isValidTime) {
      throw new BadRequestException(
        'O horário do agendamento está fora da agenda do médico.',
      );
    }
    const { data: appointment, error: createError } = await this.supabase
      .from('Appointments')
      .insert([dto])
      .select()
      .single();

    if (createError) throw new Error(createError.message);

    return appointment;
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('Appointments')
      .select('*');

    if (error) throw new Error(error.message);
    return data;
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from('Appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateStatus(
    id: string,
    status: 'agendada' | 'realizada' | 'cancelada',
  ) {
    const { data, error } = await this.supabase
      .from('Appointments')
      .update({ status })
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from('Appointments')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { message: 'Agendamento removido com sucesso.' };
  }
}
