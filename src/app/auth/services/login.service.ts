import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { handleErrorCatch } from 'src/shared/utils/helper';
import { ProfileRepository } from '../repositories/profile.repository';
import { comparePassword } from 'src/shared/utils/lib/bcrypt.helper';

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
      const passwordMatch = await comparePassword(password, user.password);
      if (!passwordMatch) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }
      return user;
    } catch (err) {
      handleErrorCatch(err);
    }
  }
}
