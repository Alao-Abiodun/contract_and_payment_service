import { Module } from '@nestjs/common';
import { DBClient } from './typeOrm.config';

@Module({
  providers: [
    {
      provide: 'DB_Client',
      useFactory: async () => {
        try {
          const client = DBClient();
          await client.connect();
          return client;
        } catch (error) {
          console.error('Error connecting to the database', error);
          process.exit(1);
        }
      },
    },
  ],
  exports: ['DB_Client'],
})
export class DatabaseModule {}
