import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { DoctorService } from '../Services/doctor.service';
import { Roles } from 'src/Common/Roles/Decorator/roles.decorator';
import { RolesGuard } from 'src/Common/Roles/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Common/Auth/Guards/jwt.guard';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async registerDoctor(
    @Body()
    dto: {
      name: string;
      email: string;
      password: string;
      imageUrl: string;
      specialty: string;
      medicalLicenseNumber: string;
    },
  ) {
    return this.doctorService.registerDoctor(dto);
  }

  @Post('login')
  async login(@Body() dto: { email: string; password: string }) {
    return this.doctorService.login(dto);
  }
}
