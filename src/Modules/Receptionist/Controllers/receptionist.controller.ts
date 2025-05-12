import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReceptionistService } from '../Services/receptionist.service';
import { Roles } from 'src/Common/Roles/Decorator/roles.decorator';
import { RolesGuard } from 'src/Common/Roles/Guards/roles.guard';
import { JwtAuthGuard } from 'src/Common/Auth/Guards/jwt.guard';
import { CreatePatientDto } from 'src/Modules/Patient/DTO/patient.dto';
import { PatientService } from 'src/Modules/Patient/Services/patient.service';

@Controller('receptionist')
export class ReceptionistController {
  constructor(
    private readonly receptionistService: ReceptionistService,
    private readonly patientService: PatientService,
  ) {}

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async registerReceptionist(
    @Body()
    dto: {
      name: string;
      email: string;
      password: string;
      workShift: string;
    },
  ) {
    return this.receptionistService.registerReceptionist(dto);
  }

  @Post('login')
  async login(@Body() dto: { email: string; password: string }) {
    return this.receptionistService.login(dto);
  }

  @Post('register-patient')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('recepcionista', 'admin')
  async registerPatient(@Body() dto: CreatePatientDto) {
    return this.patientService.registerPatient(dto);
  }
}
