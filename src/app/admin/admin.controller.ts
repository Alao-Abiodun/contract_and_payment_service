import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './services/admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('best-profession')
  async getBestProfession(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.adminService.getBestProfession(start, end);
  }

  @Get('best-clients')
  async getBestClients(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('limit') limit = 2,
  ) {
    return this.adminService.getBesClients(start, end, limit);
  }
}
