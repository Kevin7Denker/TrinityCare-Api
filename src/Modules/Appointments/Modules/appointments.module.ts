import { Module } from '@nestjs/common';
import { AppointmentService } from '../Services/appointments.service';
import { AppointmentController } from '../Controllers/appointments.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentsModule {}
