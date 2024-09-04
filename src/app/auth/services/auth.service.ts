import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { handleErrorCatch } from 'src/shared/utils/helper';
import { ProfileRepository } from '../repositories/profile.repository';
import { comparePassword } from 'src/shared/utils/lib/bcrypt.helper';
import { Profile } from '../interface/profile.interface';
import { generateJwtToken } from 'src/shared/utils/lib/jwt.helper';
import { Client } from 'pg';

@Injectable()
export class AuthService {
  private readonly profileRepository: ProfileRepository;
  private readonly client: Client;
  constructor(
    @Inject('DB_Client') client: Client,
    profileRepository: ProfileRepository,
  ) {
    this.profileRepository = profileRepository;
    this.client = client;
  }

  async signup(data: Profile) {
    const { uuid, email, password, first_name, last_name, profession, role } =
      data;
    // const user = await this.repository.getProfileByEmail(email);
    // if (user) {
    //   throw new AppError('User already exists', HttpStatus.CONFLICT);
    // }
    return await this.profileRepository.createProfile({
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
      return await this.profileRepository.getProfileByEmail(email);
    } catch (err) {
      handleErrorCatch(err);
    }
  }

  async login(email: string, password: string) {
    try {
      const profile = await this.profileRepository.getProfileByEmail(email);
      if (!profile) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const passwordMatch = await comparePassword(password, profile.password);
      if (!passwordMatch) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }

      const userToken = {
        id: profile.id,
        email: profile.email,
        role: profile.role,
      };

      const profileToken = generateJwtToken(userToken, '1h');

      return { profile, token: profileToken };
    } catch (err) {
      handleErrorCatch(err);
    }
  }

  async deposit(userId: string, data: object) {
    const { amount } = data as { amount: number };
    try {
      const _userId = parseInt(userId);
      const profileBalance = await this.profileRepository.depositBalance(
        _userId,
        amount,
      );

      return profileBalance;
    } catch (err) {
      handleErrorCatch(err);
    }
  }
}
