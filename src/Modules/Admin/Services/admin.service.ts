import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    private readonly jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async registerAdmin(dto: { name: string; email: string; password: string }) {
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
      .eq('role', 'admin')
      .single();

    if (permissionError || !permission) {
      throw new Error('Permissão para "admin" não encontrada');
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

    if (userError) {
      throw new Error(userError.message);
    }

    return { message: 'Administrador registrado com sucesso.' };
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

    if (!roleData) {
      throw new Error('Role não encontrada para o usuário');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: roleData.role,
    };

    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  async getUserById(id: string) {
    const { data: user, error } = await this.supabase
      .from('Users')
      .select('id, name, email, permission_id')
      .eq('id', id)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }

  async getAllUsers() {
    const { data: users, error } = await this.supabase
      .from('Users')
      .select('id, name, email, permission_id');

    if (error) {
      throw new UnauthorizedException('Erro ao buscar usuários');
    }

    return users;
  }

  async deleteUser(id: string) {
    const { error } = await this.supabase.from('Users').delete().eq('id', id);

    if (error) {
      throw new UnauthorizedException('Erro ao deletar usuário');
    }

    return { message: 'Usuário deletado com sucesso' };
  }

  async updateUser(id: string, dto: { name?: string; email?: string }) {
    const { error } = await this.supabase
      .from('Users')
      .update(dto)
      .eq('id', id);

    if (error) {
      throw new UnauthorizedException('Erro ao atualizar usuário');
    }

    return { message: 'Usuário atualizado com sucesso' };
  }

  async getUserPermissions(id: string) {
    const { data: permissions, error } = await this.supabase
      .from('Permissions')
      .select('role')
      .eq('id', id)
      .single();

    if (error || !permissions) {
      throw new UnauthorizedException('Permissões não encontradas');
    }

    return permissions;
  }

  async updateUserPermissions(id: string, role: string) {
    const { error } = await this.supabase
      .from('Permissions')
      .update({ role })
      .eq('id', id);

    if (error) {
      throw new UnauthorizedException('Erro ao atualizar permissões');
    }

    return { message: 'Permissões atualizadas com sucesso' };
  }

  async deleteUserPermissions(id: string) {
    const { error } = await this.supabase
      .from('Permissions')
      .delete()
      .eq('id', id);

    if (error) {
      throw new UnauthorizedException('Erro ao deletar permissões');
    }

    return { message: 'Permissões deletadas com sucesso' };
  }

  async getUserByEmail(email: string) {
    const { data: user, error } = await this.supabase
      .from('Users')
      .select('id, name, email, permission_id')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }

  async updateUserPassword(id: string, password: string) {
    const hashedPassword = await this.hashPassword(password);

    const { error } = await this.supabase
      .from('Users')
      .update({ password: hashedPassword })
      .eq('id', id);

    if (error) {
      throw new UnauthorizedException('Erro ao atualizar senha');
    }

    return { message: 'Senha atualizada com sucesso' };
  }

  async getAllPermissions() {
    const { data: permissions, error } = await this.supabase
      .from('Permissions')
      .select('id, role');

    if (error) {
      throw new UnauthorizedException('Erro ao buscar permissões');
    }

    return permissions;
  }

  async createPermission(role: string) {
    const { error } = await this.supabase.from('Permissions').insert({ role });

    if (error) {
      throw new UnauthorizedException('Erro ao criar permissão');
    }

    return { message: 'Permissão criada com sucesso' };
  }

  async deletePermission(id: string) {
    const { error } = await this.supabase
      .from('Permissions')
      .delete()
      .eq('id', id);

    if (error) {
      throw new UnauthorizedException('Erro ao deletar permissão');
    }

    return { message: 'Permissão deletada com sucesso' };
  }

  async updatePermission(id: string, role: string) {
    const { error } = await this.supabase
      .from('Permissions')
      .update({ role })
      .eq('id', id);

    if (error) {
      throw new UnauthorizedException('Erro ao atualizar permissão');
    }

    return { message: 'Permissão atualizada com sucesso' };
  }

  async getPermissionById(id: string) {
    const { data: permission, error } = await this.supabase
      .from('Permissions')
      .select('id, role')
      .eq('id', id)
      .single();

    if (error || !permission) {
      throw new UnauthorizedException('Permissão não encontrada');
    }

    return permission;
  }

  async getPermissionByRole(role: string) {
    const { data: permission, error } = await this.supabase
      .from('Permissions')
      .select('id, role')
      .eq('role', role)
      .single();

    if (error || !permission) {
      throw new UnauthorizedException('Permissão não encontrada');
    }

    return permission;
  }

  async getUserByPermissionId(permissionId: string) {
    const { data: users, error } = await this.supabase
      .from('Users')
      .select('id, name, email')
      .eq('permission_id', permissionId);

    if (error || !users) {
      throw new UnauthorizedException('Usuários não encontrados');
    }

    return users;
  }

  async getUserByRole(role: string) {
    const { data: users, error } = await this.supabase
      .from('Users')
      .select('id, name, email')
      .eq('role', role);

    if (error || !users) {
      throw new UnauthorizedException('Usuários não encontrados');
    }

    return users;
  }

  async getUserByName(name: string) {
    const { data: users, error } = await this.supabase
      .from('Users')
      .select('id, name, email')
      .ilike('name', `%${name}%`);

    if (error || !users) {
      throw new UnauthorizedException('Usuários não encontrados');
    }

    return users;
  }

  async refreshToken(token: string) {
    const { data: user, error } = await this.supabase
      .from('Users')
      .select('id, name, email, permission_id')
      .eq('refresh_token', token)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Token inválido');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.permission_id,
    };

    const newToken = this.jwtService.sign(payload);

    return { access_token: newToken };
  }

  async logout(token: string) {
    const { error } = await this.supabase
      .from('Users')
      .update({ refresh_token: null })
      .eq('refresh_token', token);

    if (error) {
      throw new UnauthorizedException('Erro ao fazer logout');
    }

    return { message: 'Logout realizado com sucesso' };
  }

  async getDoctorById(id: string) {
    const { data: doctor, error } = await this.supabase
      .from('Doctors')
      .select('id, name, email, specialty, medical_license_number')
      .eq('id', id)
      .single();

    if (error || !doctor) {
      throw new UnauthorizedException('Médico não encontrado');
    }

    return doctor;
  }

  async getAllDoctors() {
    const { data: doctors, error } = await this.supabase
      .from('Doctors')
      .select('id, name, email, specialty, medical_license_number');

    if (error) {
      throw new UnauthorizedException('Erro ao buscar médicos');
    }

    return doctors;
  }

  async deleteDoctor(id: string) {
    const { error } = await this.supabase.from('Doctors').delete().eq('id', id);

    if (error) {
      throw new UnauthorizedException('Erro ao deletar médico');
    }

    return { message: 'Médico deletado com sucesso' };
  }

  async updateDoctor(
    id: string,
    dto: { name?: string; email?: string; specialty?: string },
  ) {
    const { error } = await this.supabase
      .from('Doctors')
      .update(dto)
      .eq('id', id);

    if (error) {
      throw new UnauthorizedException('Erro ao atualizar médico');
    }

    return { message: 'Médico atualizado com sucesso' };
  }

  async getDoctorByEmail(email: string) {
    const { data: doctor, error } = await this.supabase
      .from('Doctors')
      .select('id, name, email, specialty, medical_license_number')
      .eq('email', email)
      .single();

    if (error || !doctor) {
      throw new UnauthorizedException('Médico não encontrado');
    }

    return doctor;
  }

  async getDoctorBySpecialty(specialty: string) {
    const { data: doctors, error } = await this.supabase
      .from('Doctors')
      .select('id, name, email, specialty, medical_license_number')
      .ilike('specialty', `%${specialty}%`);

    if (error || !doctors) {
      throw new UnauthorizedException('Médicos não encontrados');
    }

    return doctors;
  }
}
