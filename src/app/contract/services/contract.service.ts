import { HttpStatus, Injectable } from '@nestjs/common';
import { handleErrorCatch } from 'src/shared/utils/helper';
import { Contract } from '../interface/contract.interface';
import { ContractRepository } from '../repositories/contract.repository';
import AppError from 'src/shared/utils/lib/appError';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ContractService {
  private readonly repository: ContractRepository;
  constructor(repository: ContractRepository) {
    this.repository = repository;
  }

  async createContract(data: Contract) {
    const { terms, client_id, contractor_id } = data;
    return await this.repository.create({
      uuid: uuidv4(),
      terms,
      status: 'new',
      client_id,
      contractor_id,
    });
  }

  async getContract(id: string) {
    try {
      return await this.repository.findOne(id);
    } catch (err) {
      handleErrorCatch(err);
    }
  }
}
