import { HttpStatus, Injectable } from '@nestjs/common';
import { handleErrorCatch } from 'src/shared/utils/helper';
import { Job } from '../interface/job.interface';
import { JobRepository } from '../repositories/job.repository';
import AppError from 'src/shared/utils/lib/appError';
import { v4 as uuidv4 } from 'uuid';
import { ProfileRepository } from 'src/app/auth/repositories/profile.repository';
import { Client } from 'pg';

@Injectable()
export class JobService {
  private readonly repository: JobRepository;
  private readonly profileRepository: ProfileRepository;
  private readonly client: Client;
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
    const client = await this.client.connect();
    try {
      await client.query('BEGIN');

      const job = await this.repository.findOne(id);
      if (!job) {
        throw new AppError('Job not found', HttpStatus.NOT_FOUND);
      }

      const { client_id, contractor_id } = job;
      const clientBalance = await this.profileRepository.getBalance(client_id);
      const contractorBalance = await this.profileRepository.getBalance(
        contractor_id,
      );

      if (clientBalance < amount) {
        throw new AppError('Insufficient balance', HttpStatus.BAD_REQUEST);
      }

      await this.profileRepository.updateBalance(client_id, -amount);
      await this.profileRepository.updateBalance(contractor_id, amount);

      const updatedJob = await this.repository.payForJob(id, client);

      await client.query('COMMIT');
      return updatedJob;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
