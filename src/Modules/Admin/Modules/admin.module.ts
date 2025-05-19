import { Module } from '@nestjs/common';
import { AdminService } from '../Services/admin.service';
import { AdminController } from '../Controllers/admin.controller';
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
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
