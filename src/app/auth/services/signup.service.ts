import { HttpStatus, Injectable } from '@nestjs/common';
// import { EntityManager, Repository } from 'typeorm';
// import { Profile } from '../entity/profile.model';
import { handleErrorCatch } from 'src/shared/utils/helper';
import { Profile } from '../interface/profile.interface';
import { ProfileRepository } from '../repositories/profile.repository';
import AppError from 'src/shared/utils/lib/appError';

@Injectable()
export class SignupService {
  private readonly repository: ProfileRepository;
  constructor(repository: ProfileRepository) {
    this.repository = repository;
  }

  async signup(data: Profile) {
    const { uuid, email, password, first_name, last_name, profession, role } =
      data;
    const user = await this.repository.getProfileByEmail(email);
    if (user) {
      throw new AppError('User already exists', HttpStatus.CONFLICT);
    }
    return await this.repository.createProfile({
      uuid,
      email,
      password,
      first_name,
      last_name,
      profession,
      role,
    });
  }

  async getProfileByEmail(email: string) {
    try {
      return await this.repository.getProfileByEmail(email);
    } catch (err) {
      handleErrorCatch(err);
    }
  }
}
