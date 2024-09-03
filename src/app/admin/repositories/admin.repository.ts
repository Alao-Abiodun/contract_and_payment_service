import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class AdminRepository {
  constructor(@Inject('DB_Client') private readonly client: Client) {}

  async getBestProfession(startDate: string, endDate: string) {
    try {
      const res = await this.client.query(
        `
        SELECT 
            p.profession,
            SUM(j.price) AS total_earned
        FROM 
            jobs j
        JOIN 
            profiles p ON j.contract_id = p.id
        WHERE 
            j.paid_date BETWEEN $1 AND $2
        GROUP BY 
            p.profession
        ORDER BY 
            total_earned DESC
        LIMIT 1;
        `,
        [startDate, endDate],
      );

      if (res.rows.length === 0) {
        return { message: 'No data available for the given period' };
      }

      return res.rows[0];
    } catch (err) {
      console.error(err);
      throw new Error('Error fetching best profession');
    }
  }

  async getBestClients(startDate: string, endDate: string, limit = 2) {
    try {
      const res = await this.client.query(
        `
        SELECT 
            p.id AS client_id,
            p.first_name || ' ' || p.last_name AS client_name,
            SUM(j.price) AS total_paid
        FROM 
            jobs j
        JOIN 
            profiles p ON j.client_id = p.id
        WHERE 
            j.paid_date BETWEEN $1 AND $2
        GROUP BY 
            p.id
        ORDER BY 
            total_paid DESC
        LIMIT $3;
        `,
        [startDate, endDate, limit],
      );

      if (res.rows.length === 0) {
        return { message: 'No data available for the given period' };
      }

      return res.rows;
    } catch (err) {
      console.error(err);
      throw new Error('Error fetching best clients');
    }
  }
}
