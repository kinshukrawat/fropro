import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterOwnerDto } from './dto/register-owner.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async registerOwner(dto: RegisterOwnerDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Email is already registered.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        passwordHash,
        role: UserRole.BUSINESS_OWNER,
      },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    return { user, accessToken: this.signToken(user.id, user.email, user.role) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user?.isActive) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      accessToken: this.signToken(user.id, user.email, user.role),
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return { message: 'If the account exists, a reset token has been generated.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashResetToken(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const response: { message: string; resetToken?: string } = {
      message: 'If the account exists, a reset token has been generated.',
    };

    if (this.config.get<string>('NODE_ENV') !== 'production') {
      response.resetToken = token;
    }

    return response;
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = this.hashResetToken(token);
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) {
      throw new UnauthorizedException('Reset token is invalid or expired.');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { message: 'Password has been reset.' };
  }

  private signToken(userId: string, email: string, role: UserRole) {
    return this.jwt.sign(
      { email, role },
      {
        subject: userId,
        expiresIn: this.config.get<string>('JWT_EXPIRES_IN') ?? '1d',
      },
    );
  }

  private hashResetToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
