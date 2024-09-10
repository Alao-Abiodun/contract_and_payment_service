import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { Profile } from '../interface/profile.interface';
import { handleErrorCatch } from 'src/shared/utils/helper';
import AppError from 'src/shared/utils/lib/appError';

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
      return res.rows[0];
    } catch (err) {
      console.log('err', err);
      handleErrorCatch(err);
    }
  }

  findById(id: string) {
    return this.client.query('SELECT * FROM profiles WHERE id = $1', [id]);
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

  async getBalance(profileId: number) {
    try {
      const res = await this.client.query(
        'SELECT balance FROM profiles WHERE id = $1',
        [profileId],
      );
      return res.rows[0].balance;
    } catch (err) {
      handleErrorCatch(err);
    }
  }

  async updateBalance(profileId: number, amount: number) {
    try {
      await this.client.query('BEGIN');

      await this.client.query(
        'UPDATE profiles SET balance = balance + $1 WHERE id = $2',
        [amount, profileId],
      );

      await this.client.query('COMMIT');
    } catch (err) {
      await this.client.query('ROLLBACK');
      handleErrorCatch(err);
    }
  }

  async depositBalance(clientId: number, amount: number) {
    try {
      await this.client.query('BEGIN');

      // Calculate total outstanding payments for unpaid jobs
      const outstandingRes = await this.client.query(
        `
        SELECT SUM(j.price) AS total_outstanding
        FROM jobs j
        JOIN contracts c ON j.contract_id = c.id
        WHERE c.client_id = $1 AND j.is_paid = false
        `,
        [clientId],
      );

      const totalOutstanding = outstandingRes.rows[0]?.total_outstanding || 0;

      // Calculate 25% of the total outstanding payments
      const maxAllowedDeposit = totalOutstanding * 0.25;

      // Check if the deposit amount exceeds the allowed limit
      if (amount > maxAllowedDeposit) {
        throw new HttpException(
          'Deposit amount exceeds the allowed limit',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Lock the profile row for update to prevent race conditions
      const lockRes = await this.client.query(
        `
        SELECT balance 
        FROM profiles 
        WHERE id = $1 
        FOR UPDATE;
        `,
        [clientId],
      );

      if (lockRes.rows.length === 0) {
        throw new AppError('Profile not found', HttpStatus.NOT_FOUND);
      }

      // Perform the deposit
      const balanceRes = await this.client.query(
        `
        UPDATE profiles
        SET balance = balance + $2
        WHERE id = $1
        RETURNING balance;
        `,
        [clientId, amount],
      );

      await this.client.query('COMMIT');
      return balanceRes.rows[0];
    } catch (error) {
      await this.client.query('ROLLBACK');
      handleErrorCatch(error);
    }
  }
}
