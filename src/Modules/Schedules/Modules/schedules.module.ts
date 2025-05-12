import { Module } from '@nestjs/common';
import { ScheduleController } from '../Controllers/schedules.controller';
import { ScheduleService } from '../Services/schedules.service';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class SchedulesModule {}
