import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { Job } from '../interface/job.interface';
import { handleErrorCatch } from 'src/shared/utils/helper';

@Injectable()
export class JobRepository {
  constructor(@Inject('DB_Client') private readonly client: Client) {}

  async create({
    uuid,
    description,
    price,
    is_paid,
    paid_date,
    contract_id,
  }: Job) {
    try {
      const res = await this.client.query(
        'INSERT INTO jobs (uuid, description, price, is_paid, paid_date, contract_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
        [uuid, description, price, is_paid, paid_date, contract_id],
      );
      this.client.end();
      return res.rows[0];
    } catch (err) {
      console.log('err', err);
      handleErrorCatch(err);
    }
  }

  async findUnPaidJob() {
    try {
      const res = await this.client.query(
        'SELECT * FROM jobs WHERE is_paid = false',
      );
      return res.rows;
    } catch (err) {
      handleErrorCatch(err);
    }
  }

  async findOne(id: string) {
    try {
      const res = await this.client.query('SELECT * FROM jobs WHERE id = $1', [
        id,
      ]);
      return res.rows[0];
    } catch (err) {
      handleErrorCatch(err);
    }
  }

  //   async payForJob(id: string) {
  //     try {
  //       const res = await this.client.query(
  //         'UPDATE jobs SET is_paid = true, paid_date = NOW() WHERE id = $1 RETURNING *;',
  //         [id],
  //       );
  //       return res.rows[0];
  //     } catch (err) {
  //       handleErrorCatch(err);
  //     }
  //   }

  async payForJob(id: string, client: Client) {
    try {
      const res = await client.query(
        'UPDATE jobs SET is_paid = true, paid_date = NOW() WHERE id = $1 RETURNING *;',
        [id],
      );
      return res.rows[0];
    } catch (err) {
      handleErrorCatch(err);
    }
  }
}
