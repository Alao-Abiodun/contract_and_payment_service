import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Profile } from '../entity/profile.model';
import { InjectEntityManager } from '@nestjs/typeorm';
import { handleErrorCatch } from 'src/shared/utils/helper';

@Injectable()
export class LoginService {
  private profileRepo: Repository<Profile>;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.profileRepo = this.entityManager.getRepository(Profile);
  }

  async login(email: string, password: string) {
    try {
      const user = await this.profileRepo.findOne({ where: { email } });
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
            message: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (user.password !== password) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: 'Invalid password',
            message: 'Invalid password',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      return user;
    } catch (err) {
      handleErrorCatch(err);
    }
  }

  async getUserProfile(email: string) {
    try {
      const user = await this.profileRepo.findOne({ where: { email } });
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
            message: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (err) {
      handleErrorCatch(err);
    }
  }
}
