import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AdminService } from './services/admin.service';
import { AdminController } from './admin.controller';
import { AdminRepository } from './repositories/admin.repository';

@Module({
  imports: [DatabaseModule],
  providers: [AdminService, AdminRepository],
  controllers: [AdminController],
})
export class AdminModule {}
