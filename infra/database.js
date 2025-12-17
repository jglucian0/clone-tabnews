import { Client } from "pg";
import { ServiceError } from "./errors.js";

const sslConfig =
  process.env.POSTGRES_HOST === "localhost"
    ? false // Se for localhost, NÃO use SSL
    : { rejectUnauthorized: false };

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Erro na conexão com o Banco ou na Query.",
      cause: error,
    });
    throw serviceErrorObject;
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: sslConfig,
  });

  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;
