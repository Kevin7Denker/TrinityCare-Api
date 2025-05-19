import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmailVerificationService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async verifyToken(token: string) {
    if (!token) throw new BadRequestException('Token não fornecido.');

    const { data: users, error } = await this.supabase
      .from('Users')
      .select('id, email_verification_token, email_verification_expires')
      .not('email_verification_token', 'is', null);

    if (error) throw new BadRequestException('Erro ao acessar banco de dados.');

    if (!users || users.length === 0) {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    const now = new Date();

    for (const user of users) {
      if (user.email_verification_expires < now) continue;

      const isMatch = await bcrypt.compare(
        token,
        user.email_verification_token,
      );
      if (isMatch) {
        await this.supabase
          .from('Users')
          .update({
            is_email_verified: true,
            email_verification_token: null,
            email_verification_expires: null,
          })
          .eq('id', user.id);

        return { message: 'E-mail verificado com sucesso!' };
      }
    }

    throw new BadRequestException('Token inválido ou expirado.');
  }
}
