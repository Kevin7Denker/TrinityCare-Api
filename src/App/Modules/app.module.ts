import { Module } from '@nestjs/common';
import { AppController } from '../Controller/app.controller';
import { AppService } from '../Services/app.service';
import { SupabaseModule } from '../../Database/Modules/supabase.module';
import { DoctorsModule } from '../../Modules/Doctors/Modules/doctor.module';
import { AuthModule } from 'src/Common/Auth/Modules/auth.module';
import { AdminModule } from 'src/Modules/Admin/Modules/admin.module';
import { AppointmentsModule } from 'src/Modules/Appointments/Modules/appointments.module';
import { SchedulesModule } from 'src/Modules/Schedules/Modules/schedules.module';
import { ReceptionistsModule } from 'src/Modules/Receptionist/Modules/receptionist.module';
import { PatientsModule } from 'src/Modules/Patient/Modules/patient.module';
import { EmailModule } from 'src/Common/Emails/Modules/email.module';

@Module({
  imports: [
    SupabaseModule,
    EmailModule,
    AuthModule,
    AdminModule,
    DoctorsModule,
    AppointmentsModule,
    SchedulesModule,
    ReceptionistsModule,
    PatientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
