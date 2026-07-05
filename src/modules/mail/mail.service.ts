import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('MAIL_HOST'),
      port: Number(this.config.get('MAIL_PORT')),
      secure: false,
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASS'),
      },
    });
  }

  async sendPasswordResetEmail(
    email: string,
    token: string,
  ) {
    const frontendUrl =
      this.config.get('FRONTEND_URL') || 'http://localhost:3000';

    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: `"Hyperlocal" <${this.config.get('MAIL_USER')}>`,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h2>Reset Password</h2>
        <p>You requested to reset your password.</p>
        <p>
          <a href="${resetLink}">
            Click here to reset your password
          </a>
        </p>
        <p>This link will expire in 30 minutes.</p>
      `,
    });
  }
}