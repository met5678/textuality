type DBEnv = 'local' | 'prod';

export const DB_ENV: DBEnv = process.env.DB_ENV as DBEnv;
