import { Module } from '@nestjs/common';
import { AppController } from '../Controller/app.controller';
import { AppService } from '../Services/app.service';
import { SupabaseModule } from '../../Database/Modules/supabase.module';
import { DoctorsModule } from '../../Doctors/Modules/doctor.module';

@Module({
  imports: [SupabaseModule, DoctorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
