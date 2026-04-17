import database from "infra/database.js";
import password from "models/password.js";
import { ValidationError, NotFoundError } from "infra/errors.js";

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);
  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
        SELECT 
          *
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        LIMIT
          1
      ;`,
      values: [username],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Usuario informado não encontrado no sistema.",
        action: "Verifique se o nome de usuario esta correto.",
      });
    }

    return results.rows[0];
  }
}

async function create(userInputValues) {
  await validatePassword(userInputValues.password);
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);

  return newUser;

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password)
      VALUES
        ($1, $2, $3)
      RETURNING
        *
      ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return results.rows[0];
  }
}

async function validateUniqueUsername(username) {
  const results = await database.query({
    text: `
        SELECT
          username
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        ;`,
    values: [username],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O nome de usuario informado já está sendo utilizado.",
      action: "Utilize outro nome de usuario para realizar esta operação.",
    });
  }
}

async function validateUniqueEmail(email) {
  const results = await database.query({
    text: `
        SELECT 
          email
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
      ;`,
    values: [email],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar esta operação.",
    });
  }
}

async function validatePassword(password) {
  if (!password || String(password).trim().length === 0) {
    throw new ValidationError({
      message: "O campo password é obrigatório.",
      action: "Crie uma senha para realizar esta operação.",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedpassword = await password.hash(userInputValues.password);

  userInputValues.password = hashedpassword;
}

async function update(username, userInputValues) {
  const currentUser = await findOneByUsername(username);

  if ("username" in userInputValues) {
    const newUsername = userInputValues.username;
    if (username.toLowerCase() !== newUsername.toLowerCase()) {
      await validateUniqueUsername(newUsername);
    }
  }

  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await validatePassword(userInputValues.password);
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };
  const updatedUser = await runUpdatedQuery(userWithNewValues);
  return updatedUser;
}

async function runUpdatedQuery(userWithNewValues) {
  const results = await database.query({
    text: `
      UPDATE
        users
      SET
       username = $2,
       email = $3,
       password = $4,
       updated_at = timezone('utc', now())
      WHERE
        id = $1
      RETURNING 
        *
    `,
    values: [
      userWithNewValues.id,
      userWithNewValues.username,
      userWithNewValues.email,
      userWithNewValues.password,
    ],
  });

  return results.rows[0];
}

const user = {
  findOneByUsername,
  create,
  update,
};

export default user;
