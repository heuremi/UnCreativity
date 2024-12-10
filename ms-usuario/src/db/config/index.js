import { configs } from './config.js'
import 'dotenv/config'
import { Sequelize } from 'sequelize'

const activeConfig = configs[process.env?.ACTIVE_ENV];
export const connection = new Sequelize(process.env?.DEV_DB_URI ||'postgres://user:password@localhost:5434/user_db', {logging: false});