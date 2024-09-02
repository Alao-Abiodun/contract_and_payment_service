import { Global, Module } from '@nestjs/common';
import { DBClient } from './typeOrm.config';

@Global()
@Module({
  providers: [
    {
      provide: 'DB_Client',
      useFactory: async () => {
        const client = DBClient();
        await client.connect();
        return client;
      },
    },
  ],
  exports: ['DB_Client'],
})
export class DatabaseModule {}
