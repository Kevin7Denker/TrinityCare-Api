import { Module } from '@nestjs/common';
import { AppointmentService } from '../Services/appointments.service';
import { AppointmentController } from '../Controllers/appointments.controller';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentsModule {}
