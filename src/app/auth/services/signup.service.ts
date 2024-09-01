import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Profile } from '../entity/profile.model';
import { InjectEntityManager } from '@nestjs/typeorm';
import { handleErrorCatch } from 'src/shared/utils/helper';

@Injectable()
export class SignupService {
  private profileRepo: Repository<Profile>;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.profileRepo = this.entityManager.getRepository(Profile);
  }

  async signup(profile: Profile) {
    try {
      const user = await this.profileRepo.save(profile);
      return user;
    } catch (err) {
      handleErrorCatch(err);
    }
  }
}
