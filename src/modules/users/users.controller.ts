import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@CurrentUser() user: CurrentUser) {
    return this.users.findProfile(user.id);
  }
}
