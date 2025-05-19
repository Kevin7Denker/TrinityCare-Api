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
      .from('Users')
      .select(
        'id, email_verification_token, email_verification_expires, is_email_verified',
      )
      .eq('email_verification_token', token)
      .single();

    if (error || !data) {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    const now = new Date();
    if (new Date(data.email_verification_expires) < now) {
      throw new BadRequestException('Token expirado.');
    }

    await this.supabase
      .from('Users')
      .update({
        is_email_verified: true,
        email_verification_token: null,
        email_verification_expires: null,
      })
      .eq('id', data.id);

    return { message: 'E-mail verificado com sucesso!' };
  }
}
