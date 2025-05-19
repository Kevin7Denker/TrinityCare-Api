import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Inject } from '@nestjs/common';

@Injectable()
export class EmailVerificationService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async verifyToken(token: string) {
    if (!token) {
      throw new BadRequestException('Token não fornecido.');
    }

    const { data, error } = await this.supabase
      .from('EmailVerifications')
      .select('user_id, expires_at')
      .eq('token', token)
      .single();

    if (error || !data) {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    const now = new Date();
    if (new Date(data.expires_at) < now) {
      throw new BadRequestException('Token expirado.');
    }

    await this.supabase
      .from('Users')
      .update({ is_verified: true })
      .eq('id', data.user_id);

    await this.supabase.from('EmailVerifications').delete().eq('token', token);

    return { message: 'E-mail verificado com sucesso!' };
  }
}
