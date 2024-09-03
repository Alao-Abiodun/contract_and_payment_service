import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { JobController } from './job.controller';
import { JobService } from './services/job.service';
import { JobRepository } from './repositories/job.repository';
import { ProfileRepository } from '../auth/repositories/profile.repository';

@Module({
  imports: [DatabaseModule],
  providers: [JobService, JobRepository, ProfileRepository],
  controllers: [JobController],
  exports: [JobService, JobRepository, ProfileRepository],
})
export class JobModule {}
