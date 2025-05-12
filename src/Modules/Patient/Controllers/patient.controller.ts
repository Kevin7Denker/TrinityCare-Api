import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PatientService } from 'src/Modules/Patient/Services/patient.service';
import { CreatePatientDto } from 'src/Modules/Patient/DTO/patient.dto';
import { Roles } from 'src/Common/Roles/Decorator/roles.decorator';
import { RolesGuard } from 'src/Common/Roles/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Common/Auth/Guards/jwt.guard';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('login')
  async login(@Body() dto: { email: string; password: string }) {
    return this.patientService.login(dto);
  }
}
