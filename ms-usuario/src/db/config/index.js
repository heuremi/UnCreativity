import { configs } from './config.js'

import { Sequelize } from 'sequelize'

const activeConfig = configs[process.env?.ACTIVE_ENV];

export const connection = new Sequelize('postgres://user:password@localhost:5434/user_db', {logging: false});