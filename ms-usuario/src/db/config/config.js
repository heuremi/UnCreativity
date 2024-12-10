import 'dotenv/config'

export const configs = {
    development: {
        uri: process.env?.DEV_DB_URI ?? 'postgres://user:password@localhost:5432/user_db',
        logging: true
    }

}