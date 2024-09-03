import { HttpStatus, Inject, Injectable } from '@nestjs/common';
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
      this.client.end();
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

  async getBalance(id: string) {
    try {
      const res = await this.client.query(
        'SELECT balance FROM jobs WHERE  = $1',
        [id],
      );
      return res.rows[0];
    } catch (err) {
      handleErrorCatch(err);
    }
  }

  // update balance using transaction and locks
  async updateBalance(id: string, amount: number) {
    try {
      await this.client.query('BEGIN');
      const res = await this.client.query(
        'UPDATE profiles SET balance = balance + $2 WHERE id = $1 RETURNING *;',
        [id, amount],
      );
      await this.client.query('COMMIT');
      return res.rows[0];
    } catch (err) {
      await this.client.query('ROLLBACK');
      handleErrorCatch(err);
    }
  }

  async depositBalance(id: string, amount: number) {
    try {
      await this.client.query('BEGIN');
      // Calculate total outstanding payments for unpaid jobs
      const outstandingRes = await this.client.query(
        'SELECT SUM(price) as total_outstanding FROM jobs WHERE contract_id = $1 AND is_paid = false',
        [id],
      );

      const totalOutstanding = outstandingRes.rows[0]?.total_outstanding || 0;

      // Calculate 25% of the total outstanding payments
      const maxAllowedDeposit = totalOutstanding * 0.25;

      // Check if the deposit amount exceeds the allowed limit
      if (amount > maxAllowedDeposit) {
        throw new AppError(
          'Deposit amount exceeds the allowed limit',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Perform the deposit
      await this.client.query(
        'UPDATE profiles SET balance = balance + $1 WHERE id = $2',
        [amount, id],
      );

      await this.client.query('COMMIT');
    } catch (error) {
      await this.client.query('ROLLBACK');
      handleErrorCatch(error);
    }
  }
}
