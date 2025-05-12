import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from '../Services/appointments.service';
import { CreateAppointmentDto } from '../DTO/appointments.dto';
import { JwtAuthGuard } from 'src/Common/Auth/Guards/jwt.guard';
import { Roles } from 'src/Common/Roles/Decorator/roles.decorator';
import { RolesGuard } from 'src/Common/Roles/Guards/roles.guard';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('recepcionista')
  async create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'medico', 'recepcionista')
  @Get()
  async findAll() {
    return this.appointmentService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'medico', 'recepcionista')
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.appointmentService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('patient/:pacient_id')
  async findByPatientId(@Param('patient_id') patientId: string) {
    return this.appointmentService.findByPatientId(patientId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'medico', 'recepcionista')
  @Post('doctor/:doctor_id')
  async findByDoctorId(@Param('doctor_id') doctorId: string) {
    return this.appointmentService.findByDoctorId(doctorId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'medico')
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.appointmentService.updateStatus(id, body.status as any);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'recepcionista')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.appointmentService.delete(id);
  }
}
