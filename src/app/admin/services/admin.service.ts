import { HttpStatus, Injectable } from '@nestjs/common';
import { handleErrorCatch } from 'src/shared/utils/helper';
import { AdminRepository } from '../repositories/admin.repository';

@Injectable()
export class AdminService {
  private readonly repository: AdminRepository;
  constructor(repository: AdminRepository) {
    this.repository = repository;
  }

  async getBestProfession(start: string, end: string) {
    try {
      return await this.repository.getBestProfession(start, end);
    } catch (err) {
      handleErrorCatch(err);
    }
  }

  async getBesClients(start: string, end: string, limit: number) {
    try {
      return await this.repository.getBestClients(start, end, limit);
    } catch (err) {
      handleErrorCatch(err);
    }
  }
}
