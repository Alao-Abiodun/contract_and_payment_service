import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { JobService } from './services/job.service';
import { Job, payJob } from './interface/job.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/v1/jobs')
@ApiTags('auth')
@ApiBearerAuth()
export class JobController {
  constructor(
    @Inject(JobService)
    private readonly jobService: JobService,
  ) {}

  @Post('')
  async createJob(@Body() data: Job) {
    return this.jobService.createJob(data);
  }

  @Get('unpaid')
  async getUnpaidJobs() {
    return this.jobService.getUnPaidJobs();
  }

  @Post(':id/pay')
  async payJob(@Param('id') id: string, @Body() data: payJob) {
    return this.jobService.payJob(id, data);
  }
}
