import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    const user = this.config.get<string>('MAIL_USER');
    const pass = this.config.get<string>('MAIL_PASS');

    if (!user || !pass) {
      throw new Error(
        'MAIL_USER or MAIL_PASS is missing in your .env.local file',
      );
    }

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

    try {
      await this.transporter.sendMail({
        from: `"Oye Rohini" <${this.config.get('MAIL_USER')}>`,
        to: email,
        subject: 'Reset Your Password',
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px;">
            <h2>Password Reset</h2>

            <p>You requested to reset your password.</p>

            <p>
              <a
                href="${resetLink}"
                style="
                  background:#2563eb;
                  color:#fff;
                  padding:12px 20px;
                  text-decoration:none;
                  border-radius:6px;
                  display:inline-block;
                "
              >
                Reset Password
              </a>
            </p>

            <p>This link will expire in <b>30 minutes</b>.</p>

            <p>If you didn't request this, you can ignore this email.</p>
          </div>
        `,
      });

      this.logger.log(`Password reset email sent to ${email}`);
    } catch (err) {
      this.logger.error('Error sending email', err);
      throw err;
    }
  }
}