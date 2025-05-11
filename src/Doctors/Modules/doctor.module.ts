import { Module } from '@nestjs/common';
import { DoctorService } from '../Services/doctor.service';
import { DoctorController } from '../Controllers/doctor.controller';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorsModule {}
