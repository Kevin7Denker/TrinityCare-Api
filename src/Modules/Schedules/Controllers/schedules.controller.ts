import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ScheduleService } from '../Services/schedules.service';
import { CreateScheduleDto } from '../DTO/schedules.dto';
import { JwtAuthGuard } from 'src/Common/Auth/Guards/jwt.guard';
import { RolesGuard } from 'src/Common/Roles/Guards/roles.guard';
import { Roles } from 'src/Common/Roles/Decorator/roles.decorator';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('medico')
  async create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.create(dto);
  }

  @Get('doctor/:doctor_id')
  async findByDoctor(@Param('doctor_id') doctorId: string) {
    return this.scheduleService.findByDoctor(doctorId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.scheduleService.delete(id);
  }
}
