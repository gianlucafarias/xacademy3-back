import { Sequelize } from 'sequelize';
import {config} from './config';

export const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect,
});

const initializeDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: false });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default initializeDB;