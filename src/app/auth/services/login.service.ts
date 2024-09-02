import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Profile } from '../entity/profile.model';
import { InjectEntityManager } from '@nestjs/typeorm';
import { handleErrorCatch } from 'src/shared/utils/helper';
import { ProfileRepository } from '../repositories/profile.repository';

@Injectable()
export class LoginService {
  private readonly repository: ProfileRepository;
  constructor(repository: ProfileRepository) {
    this.repository = repository;
  }

  async login(email: string, password: string) {
    try {
      const user = await this.repository.getProfileByEmail(email);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (user.password !== password) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }
      return user;
    } catch (err) {
      handleErrorCatch(err);
    }
  }
}
