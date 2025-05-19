import { Module } from '@nestjs/common';
import { DoctorService } from '../Services/doctor.service';
import { DoctorController } from '../Controllers/doctor.controller';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { EmailModule } from 'src/Common/Emails/Modules/email.module';
dotenv.config();

@Module({
  imports: [
    EmailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorsModule {}
