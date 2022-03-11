export type DbConfigType = {
  port: number;
  host: string;
  user: string;
  password: string;
  database: string;
};

const db = (): DbConfigType => {
  const response = {
    port: process.env.DB_PORT === undefined ? 3306 : +process.env.DB_PORT,
    host: process.env.DB_HOST === undefined ? '127.0.0.1' : process.env.DB_HOST,
    user: process.env.DB_USER === undefined ? '' : process.env.DB_USER,
    password:
      process.env.DB_PASSWORD === undefined ? '' : process.env.DB_PASSWORD,
    database:
      process.env.DB_DATABASE === undefined ? '' : process.env.DB_DATABASE,
  };

  return response;
};

export default db;
