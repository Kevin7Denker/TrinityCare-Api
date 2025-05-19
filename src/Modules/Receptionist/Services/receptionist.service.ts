import {
  Injectable,
  Inject,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { ResendService } from '../../../Common/Emails/Services/resend.service';

@Injectable()
export class ReceptionistService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    private readonly jwtService: JwtService,
    private readonly resendService: ResendService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async registerReceptionist(dto: {
    name: string;
    email: string;
    password: string;
    workShift: string;
  }) {
    const { data: existingUser } = await this.supabase
      .from('Users')
      .select('id')
      .eq('email', dto.email)
      .single();

    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const { data: permission, error: permissionError } = await this.supabase
      .from('Permissions')
      .select('id')
      .eq('role', 'recepcionista')
      .single();

    if (permissionError || !permission) {
      throw new Error('Permissão para "recepcionista" não encontrada');
    }

    const { data: user, error: userError } = await this.supabase
      .from('Users')
      .insert([
        {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          permission_id: permission.id,
        },
      ])
      .select()
      .single();

    if (userError) throw new Error(userError.message);

    const { error: receptionistError } = await this.supabase
      .from('Receptionists')
      .insert([
        {
          user_id: user.id,
          work_shift: dto.workShift,
        },
      ]);

    if (receptionistError) throw new Error(receptionistError.message);

    const rawToken = uuid();
    const hashedToken = await bcrypt.hash(rawToken, 10);
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await this.supabase
      .from('Users')
      .update({
        email_verification_token: hashedToken,
        email_verification_expires: expires,
        is_email_verified: false,
      })
      .eq('id', user.id);

    await this.resendService.sendEmailVerification(user.email, rawToken);

    return {
      message:
        'Recepcionista registrado. Verifique seu e-mail para ativar a conta.',
    };
  }

  async login(dto: { email: string; password: string }) {
    const { data: user, error } = await this.supabase
      .from('Users')
      .select('id, name, email, password, permission_id, is_email_verified')
      .eq('email', dto.email)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isValid = await this.comparePassword(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Senha incorreta');

    if (!user.is_email_verified) {
      throw new UnauthorizedException(
        'Você precisa verificar seu e-mail antes de entrar.',
      );
    }

    const { data: roleData } = await this.supabase
      .from('Permissions')
      .select('role')
      .eq('id', user.permission_id)
      .single();

    if (!roleData) throw new Error('Role não encontrada para o usuário');

    const payload = {
      sub: user.id,
      email: user.email,
      role: roleData.role,
    };

    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
