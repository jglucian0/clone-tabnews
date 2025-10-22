// Request trata do objeto de requisição HTTP
// Response trata do objeto de resposta HTTP
// Método .send() não envia o charset (tipo de teclado utilizado) automaticamente
// Método .json() envia o charset automaticamente (utf-8)

import database from "../../../../infra/database.js";

async function status(request, response) {
  const result = await database.query('SELECT 1 + 1 as sum;');
  console.log(result.rows);
  response.status(200).send({ chave: "valor" });
}

export default status;