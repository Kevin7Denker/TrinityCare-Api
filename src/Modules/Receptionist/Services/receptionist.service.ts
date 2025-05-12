import {
  Injectable,
  Inject,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ReceptionistService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    private readonly jwtService: JwtService,
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

    return { message: 'Recepcionista registrado com sucesso.' };
  }

  async login(dto: { email: string; password: string }) {
    const { data: user, error } = await this.supabase
      .from('Users')
      .select('id, name, email, password, permission_id')
      .eq('email', dto.email)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isValid = await this.comparePassword(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Senha incorreta');

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
