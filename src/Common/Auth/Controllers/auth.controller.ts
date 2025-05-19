import { Controller, Get, Query } from '@nestjs/common';
import { EmailVerificationService } from '../../Emails/Services/email-verification.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly emailVerification: EmailVerificationService) {}

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.emailVerification.verifyToken(token);
  }
}
