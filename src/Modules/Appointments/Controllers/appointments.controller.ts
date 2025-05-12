import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { AppointmentService } from '../Services/appointments.service';
import { CreateAppointmentDto } from '../DTO/appointments.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(dto);
  }

  @Get()
  async findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.appointmentService.findById(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.appointmentService.updateStatus(id, body.status as any);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.appointmentService.delete(id);
  }
}
