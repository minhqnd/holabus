import sql from 'mssql';

const config: sql.config = {
  server: process.env.DB_SERVER?.trim() || '',
  port: parseInt(process.env.DB_PORT || '1433'),
  user: process.env.DB_USER?.trim() || '',
  password: process.env.DB_PASSWORD?.trim() || '',
  database: process.env.DB_NAME?.trim() || '',
  options: {
    encrypt: true,
    trustServerCertificate: true, // Crucial for Vercel/AWS to Azure SQL
  },
  connectionTimeout: 30000, // Increase timeout to 30s
  requestTimeout: 30000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    console.log('Attempting to connect to SQL server:', config.server);
    pool = await sql.connect(config);
    console.log('Successfully connected to Azure SQL');
  }
  return pool;
}

export { sql };
