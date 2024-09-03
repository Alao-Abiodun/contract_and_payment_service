import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { handleErrorCatch } from 'src/shared/utils/helper';
import { ProfileRepository } from '../repositories/profile.repository';
import { comparePassword } from 'src/shared/utils/lib/bcrypt.helper';
import { Profile } from '../interface/profile.interface';
import { generateJwtToken } from 'src/shared/utils/lib/jwt.helper';

@Injectable()
export class AuthService {
  private readonly repository: ProfileRepository;
  constructor(repository: ProfileRepository) {
    this.repository = repository;
  }

  async signup(data: Profile) {
    const { uuid, email, password, first_name, last_name, profession, role } =
      data;
    // const user = await this.repository.getProfileByEmail(email);
    // if (user) {
    //   throw new AppError('User already exists', HttpStatus.CONFLICT);
    // }
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

  async login(email: string, password: string) {
    try {
      const profile = await this.repository.getProfileByEmail(email);
      if (!profile) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const passwordMatch = await comparePassword(password, profile.password);
      if (!passwordMatch) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }

      console.log('profile', profile);

      const userToken = {
        id: profile.id,
        email: profile.email,
      };

      const profileToken = generateJwtToken(userToken, '1h');

      return { profile, token: profileToken };
    } catch (err) {
      handleErrorCatch(err);
    }
  }

  async deposit(userId: string, amount: number) {
    try {
      return await this.repository.updateBalance(userId, amount);
    } catch (err) {
      handleErrorCatch(err);
    }
  }
}
