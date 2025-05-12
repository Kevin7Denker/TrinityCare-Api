import { Module } from '@nestjs/common';
import { ScheduleService } from '../Services/schedules.service';
import { ScheduleController } from '../Controllers/schedules.controller';
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
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class SchedulesModule {}
