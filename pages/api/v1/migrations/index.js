// Request trata do objeto de requisição HTTP
// Response trata do objeto de resposta HTTP
// Método .send() não envia o charset (tipo de teclado utilizado) automaticamente
// Método .json() envia o charset automaticamente (utf-8)

import migrationRunner from 'node-pg-migrate'
import { join } from 'node:path'
import database from 'infra/database.js'
import { channel } from 'node:diagnostics_channel';

export default async function migrations(request, response) {
  const allowebMethods = ['GET', 'POST'];
  if (!allowebMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient(); // Abre conexao com o banco de dados

    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join('infra', 'migrations'),
      direction: 'up',
      verbose: true,
      migrationsTable: 'pgmigrations',
    }

    if (request.method === 'GET') {
      const pendingMigrations = await migrationRunner({
        ...defaultMigrationOptions,
      });

      return response.status(200).send(pendingMigrations);
    }

    if (request.method === 'POST') {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).send(migratedMigrations);
      }
      return response.status(200).send(migratedMigrations);
    }

  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}