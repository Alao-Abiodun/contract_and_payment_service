import * as typeorm from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export default new typeorm.DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, '..', '**', '*.model.{js,ts}')],
  migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
  synchronize: false,
  extra: {
    trustServerCertificate: true,
  },
});
