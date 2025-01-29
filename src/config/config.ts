import { Dialect } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

interface DBConfig {
  database: string;
  username: string;
  password: string;
  host: string;
  dialect: Dialect;
}

export const config: { db: DBConfig } = {
  db: {
    database: process.env.DB_DATABASE || 'xacademydb',
    username: process.env.DB_USERNAME || ' ',
    password: process.env.DB_PASSWORD || ' ',
    host: 'localhost',
    dialect: 'mysql'
  }
};