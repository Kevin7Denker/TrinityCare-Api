import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ResendService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendEmailVerification(to: string, token: string) {
    const verifyUrl = `https://trinitycare.com/verify-email?token=${token}`;

    await this.resend.emails.send({
      from: 'noreply@kvdenker.com',
      to,
      subject: 'Verifique seu e-mail - TrinityCare',
      html: `
        <h2>Bem-vindo ao TrinityCare!</h2>
        <p>Clique no link abaixo para verificar seu e-mail:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <p>Este link expira em 1 hora.</p>
      `,
    });
  }
}
