import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { handleErrorCatch } from 'src/shared/utils/helper';
import { Job } from '../interface/job.interface';
import { JobRepository } from '../repositories/job.repository';
import AppError from 'src/shared/utils/lib/appError';
import { v4 as uuidv4 } from 'uuid';
import { ProfileRepository } from 'src/app/auth/repositories/profile.repository';
import { Client } from 'pg';
import { ContractRepository } from 'src/app/contract/repositories/contract.repository';

@Injectable()
export class JobService {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly contractRepository: ContractRepository,
  ) {}

  async createJob(data: Job) {
    const { description, price, contract_id } = data;
    const contract = await this.contractRepository.findOne(contract_id);
    if (!contract) {
      throw new AppError('Contract not found', HttpStatus.NOT_FOUND);
    }
    return await this.jobRepository.create({
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
      return await this.jobRepository.findUnPaidJob();
    } catch (err) {
      handleErrorCatch(err);
    }
  }

  async payJob(id: string, data: object) {
    const { amount } = data as { amount: number };
    try {
      const job = await this.jobRepository.findOne(id);
      if (!job) {
        throw new AppError('Job not found', HttpStatus.NOT_FOUND);
      }

      const { contract_id } = job;
      const contract = await this.contractRepository.findOne(contract_id);
      if (!contract) {
        throw new AppError('Contract not found', HttpStatus.NOT_FOUND);
      }

      const { client_id, contractor_id } = contract;

      const clientBalance = await this.profileRepository.getBalance(client_id);

      if (parseInt(clientBalance) < amount) {
        throw new AppError('Insufficient balance', HttpStatus.BAD_REQUEST);
      }

      await Promise.all([
        this.profileRepository.updateBalance(client_id, -amount),
        this.profileRepository.updateBalance(contractor_id, amount),
      ]);

      const updatedJob = await this.jobRepository.payForJob(id);

      await this.contractRepository.updateStatus(contract_id, 'completed');

      return updatedJob;
    } catch (err) {
      handleErrorCatch(err);
    }
  }
}
