// Request trata do objeto de requisição HTTP
// Response trata do objeto de resposta HTTP
// Método .send() não envia o charset (tipo de teclado utilizado) automaticamente
// Método .json() envia o charset automaticamente (utf-8)

function status(request, response) {
  response.status(200).send({ chave: "valor" });
}

export default status;