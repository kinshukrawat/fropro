import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly cities: CitiesService) {}

  @Get()
  findActive() {
    return this.cities.findActive();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateCityDto) {
    return this.cities.create(dto);
  }
}
