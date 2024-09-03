import { HttpStatus, Injectable } from '@nestjs/common';
import { handleErrorCatch } from 'src/shared/utils/helper';
import { Job } from '../interface/job.interface';
import { JobRepository } from '../repositories/job.repository';
import AppError from 'src/shared/utils/lib/appError';
import { v4 as uuidv4 } from 'uuid';
import { ProfileRepository } from 'src/app/auth/repositories/profile.repository';

@Injectable()
export class JobService {
  private readonly repository: JobRepository;
  private readonly profileRepository: ProfileRepository;
  constructor(repository: JobRepository, profileRepository: ProfileRepository) {
    this.repository = repository;
    this.profileRepository = profileRepository;
  }

  async createJob(data: Job) {
    const { description, price, contract_id } = data;
    return await this.repository.create({
      uuid: uuidv4(),
      description,
      price,
      is_paid: false,
      paid_date: null,
      contract_id,
    });
  }

  async getUnPaidJobs() {
    try {
      return await this.repository.findUnPaidJob();
    } catch (err) {
      handleErrorCatch(err);
    }
  }

  async payJob(id: string, amount: number) {
    try {
      const job = await this.repository.findOne(id);
      if (!job) {
        throw new AppError('Job not found', HttpStatus.NOT_FOUND);
      }
      const balance = await this.profileRepository.getBalance(id);

      if (balance < amount) {
        throw new AppError('Insufficient balance', HttpStatus.BAD_REQUEST);
      }
      await this.repository.payForJob(id);
    } catch (error) {}
  }
}
