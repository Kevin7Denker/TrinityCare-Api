import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AdminService } from '../Services/admin.service';
import { Roles } from 'src/Common/Roles/Decorator/roles.decorator';
import { RolesGuard } from 'src/Common/Roles/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Common/Auth/Guards/jwt.guard';
import { RegisterAdminDto } from '../DTO/admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(@Body() dto: { email: string; password: string }) {
    return this.adminService.login(dto);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async registerAdmin(@Body() dto: RegisterAdminDto) {
    return this.adminService.registerAdmin(dto);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async refresh(@Body() dto: { refreshToken: string }) {
    return this.adminService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async logout(@Body() dto: { refreshToken: string }) {
    return this.adminService.logout(dto.refreshToken);
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteAdmin(@Body() dto: { id: string }) {
    return this.adminService.deleteUser(dto.id);
  }

  @Post('update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateAdmin(
    @Body()
    dto: {
      id: string;
      name?: string;
      email?: string;
      password?: string;
      imageUrl?: string;
    },
  ) {
    return this.adminService.updateUser(dto.id, dto);
  }

  @Post('get')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUserById(@Body() dto: { id: string }) {
    return this.adminService.getUserById(dto.id);
  }

  @Post('getAll')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Post('getPermissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUserPermissions(@Body() dto: { id: string }) {
    return this.adminService.getUserPermissions(dto.id);
  }

  @Post('getAllPermissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllPermissions() {
    return this.adminService.getAllPermissions();
  }

  @Post('updatePermission')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updatePermission(
    @Body()
    dto: {
      id: string;
      permissionId: string;
    },
  ) {
    return this.adminService.updatePermission(dto.id, dto.permissionId);
  }

  @Post('deletePermission')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deletePermission(@Body() dto: { id: string }) {
    return this.adminService.deletePermission(dto.id);
  }

  @Post('createPermission')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createPermission(
    @Body()
    dto: {
      name: string;
      description: string;
      role: string;
    },
  ) {
    return this.adminService.createPermission(dto.role);
  }

  @Post('updatePermissionName')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updatePermissionName(
    @Body()
    dto: {
      id: string;
      name: string;
    },
  ) {
    return this.adminService.updatePermission(dto.id, dto.name);
  }

  @Post('updatePassword')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updatePassword(
    @Body()
    dto: {
      id: string;
      password: string;
    },
  ) {
    return this.adminService.updateUserPassword(dto.id, dto.password);
  }

  @Post('getAllDoctors')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllDoctors() {
    return this.adminService.getAllDoctors();
  }

  @Post('getDoctorById')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getDoctorById(@Body() dto: { id: string }) {
    return this.adminService.getDoctorById(dto.id);
  }

  @Post('deleteDoctor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteDoctor(@Body() dto: { id: string }) {
    return this.adminService.deleteDoctor(dto.id);
  }

  @Post('updateDoctor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateDoctor(
    @Body()
    dto: {
      id: string;
      name?: string;
      email?: string;
      password?: string;
      imageUrl?: string;
      specialty?: string;
      medicalLicenseNumber?: string;
    },
  ) {
    return this.adminService.updateDoctor(dto.id, dto);
  }

  @Post('getDoctorBySpecialty')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getDoctorBySpecialty(@Body() dto: { specialty: string }) {
    return this.adminService.getDoctorBySpecialty(dto.specialty);
  }
}
