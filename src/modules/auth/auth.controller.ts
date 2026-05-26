import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RegisterOwnerDto } from './dto/register-owner.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  registerOwner(@Body() dto: RegisterOwnerDto) {
    return this.auth.registerOwner(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('password-reset/request')
  requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    return this.auth.requestPasswordReset(dto.email);
  }

  @Post('password-reset/confirm')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.token, dto.newPassword);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@CurrentUser() user: CurrentUser) {
    return user;  
  }
}
