import { Dialect } from 'sequelize';

interface DBConfig {
  database: string;
  username: string;
  password: string;
  host: string;
  dialect: Dialect;
}

export const config: { db: DBConfig } = {
  db: {
    database: 'xacademydb',
    username: ' ',
    password: ' ',
    host: 'localhost',
    dialect: 'mysql'
  }
};