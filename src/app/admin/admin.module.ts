import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AdminService } from './services/admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [DatabaseModule],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
