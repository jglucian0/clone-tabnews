import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
// eslint-disable-next-line no-unused-vars
import { channel } from "node:diagnostics_channel";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;
  const newUser = await user.create(userInputValues);

  return response.status(201).send(newUser);
}
