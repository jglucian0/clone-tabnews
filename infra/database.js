import { Client } from 'pg';

const sslConfig = process.env.POSTGRES_HOST === 'localhost'
  ? false // Se for localhost, NÃO use SSL
  : { rejectUnauthorized: false }; // Para TUDO mais (Neon, etc), use SSL

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: sslConfig,
  });

  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query: query,
}