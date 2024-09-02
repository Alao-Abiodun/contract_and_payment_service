import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { Profile } from '../interface/profile.interface';
import { handleErrorCatch } from 'src/shared/utils/helper';

@Injectable()
export class ProfileRepository {
  constructor(@Inject('DB_Client') private readonly client: Client) {}

  async createProfile({
    uuid,
    email,
    password,
    first_name,
    last_name,
    profession,
    role,
  }: Profile) {
    try {
      const res = await this.client.query(
        'INSERT INTO profiles (uuid, email, password, first_name, last_name, profession, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
        [uuid, email, password, first_name, last_name, profession, role],
      );
      this.client.end();
      return res.rows[0];
    } catch (err) {
      console.log('err', err);
      handleErrorCatch(err);
    }
  }

  async getProfileByEmail(email: string) {
    try {
      const res = await this.client.query(
        'SELECT * FROM profiles WHERE email = $1',
        [email],
      );
      return res.rows[0];
    } catch (err) {
      handleErrorCatch(err);
    }
  }
}
