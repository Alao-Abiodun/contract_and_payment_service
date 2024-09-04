import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { JobController } from './job.controller';
import { JobService } from './services/job.service';
import { JobRepository } from './repositories/job.repository';
import { ProfileRepository } from '../auth/repositories/profile.repository';
import { ContractRepository } from '../contract/repositories/contract.repository';

@Module({
  imports: [DatabaseModule],
  providers: [JobService, JobRepository, ProfileRepository, ContractRepository],
  controllers: [JobController],
})
export class JobModule {}
