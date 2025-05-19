import { Module } from '@nestjs/common';
import { ResendService } from '../Services/resend.service';

@Module({
  providers: [ResendService],
  exports: [ResendService],
})
export class EmailModule {}
