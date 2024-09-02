import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { Contract } from '../interface/contract.interface';
import { handleErrorCatch } from 'src/shared/utils/helper';

@Injectable()
export class ContractRepository {
  constructor(@Inject('DB_Client') private readonly client: Client) {}

  async create({ uuid, terms, status, client_id, contractor_id }: Contract) {
    try {
      const res = await this.client.query(
        'INSERT INTO contracts (uuid, terms, status, client_id, contractor_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
        [uuid, terms, status, client_id, contractor_id],
      );
      this.client.end();
      return res.rows[0];
    } catch (err) {
      console.log('err', err);
      handleErrorCatch(err);
    }
  }

  async findOne(id: string) {
    try {
      const res = await this.client.query(
        'SELECT * FROM contracts WHERE id = $1',
        [id],
      );
      return res.rows[0];
    } catch (err) {
      handleErrorCatch(err);
    }
  }
}
