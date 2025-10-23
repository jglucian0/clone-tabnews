// Request trata do objeto de requisição HTTP
// Response trata do objeto de resposta HTTP
// Método .send() não envia o charset (tipo de teclado utilizado) automaticamente
// Método .json() envia o charset automaticamente (utf-8)

import database from "infra/database";

async function status(request, response) {
  const updateAt = new Date().toISOString();
  const databaseVersionResult = await database.query('SHOW server_version;');
  const databaseVersionValue = databaseVersionResult.rows[0].server_version

  const databaseMaxConnectionsResult = await database.query('SHOW max_connections;');
  const databaseMaxConnectionsValue = parseInt(databaseMaxConnectionsResult.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB
  const databaseOpenedConnectionsResult = await database.query({ text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;", values: [databaseName] });
  const databaseOpenedConnections = databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).send({
    update_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: databaseMaxConnectionsValue,
        opened_connections: databaseOpenedConnections,
      }
    },
  });
}

export default status;