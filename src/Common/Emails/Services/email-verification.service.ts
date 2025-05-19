import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmailVerificationService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async verifyToken(token: string) {
    const { data: users } = await this.supabase
      .from('Users')
      .select('*')
      .gt('email_verification_expires', new Date());

    const user = users?.find((u) =>
      bcrypt.compareSync(token, u.email_verification_token),
    );

    if (!user) throw new BadRequestException('Token inválido ou expirado.');

    await this.supabase
      .from('Users')
      .update({
        is_email_verified: true,
        email_verification_token: null,
        email_verification_expires: null,
      })
      .eq('id', user.id);

    return { message: 'E-mail verificado com sucesso.' };
  }
}
