import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PatientService {
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

  async registerPatient(dto: {
    name: string;
    email: string;
    password: string;
    phone: string;
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

    const { data: permission } = await this.supabase
      .from('Permissions')
      .select('id')
      .eq('role', 'paciente')
      .single();

    if (!permission) {
      throw new ConflictException('Permission not found for role "paciente".');
    }

    const { data: user } = await this.supabase
      .from('Users')
      .insert([
        {
          email: dto.email,
          name: dto.name,
          password: hashedPassword,
          permission_id: permission.id,
        },
      ])
      .select()
      .single();

    await this.supabase.from('Patients').insert([
      {
        user_id: user.id,
        phone: dto.phone,
      },
    ]);

    return { message: 'Paciente registrado com sucesso.' };
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

    if (!roleData || roleData.role !== 'paciente') {
      throw new UnauthorizedException('Acesso não permitido');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: roleData.role,
    };

    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
