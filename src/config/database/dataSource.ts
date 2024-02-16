import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export const dataSource = new DataSource(
  {
    type: 'sqlite',
    database: 'src/config/database/db.sqlite',
    synchronize: true,
    migrations: ['src/config/database/migrations/**/*.ts'],
    entities: ['src/entities/*.ts'],
  }
);
