import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../Strategy/jwt.strategy';
import * as dotenv from 'dotenv';
import { AuthController } from '../Controllers/auth.controller';
import { EmailVerificationService } from 'src/Common/Emails/Services/email-verification.service';

dotenv.config();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtStrategy, EmailVerificationService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
