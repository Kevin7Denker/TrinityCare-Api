import { Module } from '@nestjs/common';
import { PatientService } from '../Services/patient.service';
import { PatientController } from '../Controllers/patient.controller';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/Common/Emails/Modules/email.module';

@Module({
  imports: [
    EmailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientsModule {}
