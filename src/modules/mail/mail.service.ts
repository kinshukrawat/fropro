import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as dns from 'node:dns';

// Force Node.js to prefer IPv4 over IPv6
dns.setDefaultResultOrder('ipv4first');

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    
    const user = this.config.get<string>('MAIL_USER');
    const pass = this.config.get<string>('MAIL_PASS');


    this.logger.log(`MAIL_USER = ${user}`);

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },

    });
  }

  async sendPasswordResetEmail(
    email: string,
    token: string,
  ): Promise<void> {
    const frontendUrl =
      this.config.get<string>('FRONTEND_URL') ||
      'http://localhost:5173';

    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection successful');
    } catch (err) {
      this.logger.error('SMTP verify failed', err);
      throw err;
    }

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

    this.logger.log(`Password reset email sent to ${email}`);
  }
}