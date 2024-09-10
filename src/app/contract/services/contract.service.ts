import { HttpStatus, Injectable } from '@nestjs/common';
import { handleErrorCatch } from 'src/shared/utils/helper';
import { Contract } from '../interface/contract.interface';
import { ContractRepository } from '../repositories/contract.repository';
import AppError from 'src/shared/utils/lib/appError';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ContractService {
  constructor(private readonly repository: ContractRepository) {}

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

  async getSingleContracts(id: string, profileId: number) {
    const _profile = parseInt(profileId.toString());

    try {
      const contract = await this.repository.findOne(id);
      if (
        contract.client_id !== _profile &&
        contract.contractor_id !== _profile
      ) {
        throw new AppError(
          'You are not authorized to access this contract',
          HttpStatus.FORBIDDEN,
        );
      }
      return contract;
    } catch (err) {
      console.log('err', err);
      handleErrorCatch(err);
    }
  }

  async getContracts() {
    try {
      return await this.repository.find();
    } catch (err) {
      handleErrorCatch(err);
    }
  }
}
