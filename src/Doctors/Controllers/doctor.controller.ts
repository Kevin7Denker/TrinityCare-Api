import { Controller, Post, Body } from '@nestjs/common';
import { DoctorService } from '../Services/doctor.service';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('register')
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
