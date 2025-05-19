import { Module } from '@nestjs/common';
import { ReceptionistController } from '../Controllers/receptionist.controller';
import { ReceptionistService } from '../Services/receptionist.service';
import { PatientsModule } from '../../../Modules/Patient/Modules/patient.module';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/Common/Emails/Modules/email.module';

@Module({
  imports: [
    EmailModule,
    PatientsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [ReceptionistController],
  providers: [ReceptionistService],
})
export class ReceptionistsModule {}
