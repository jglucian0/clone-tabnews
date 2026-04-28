import database from "infra/database.js";
import crypto from "node:crypto";

const EXPIRETION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000; // 30 Days

async function create(userId) {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRETION_IN_MILLISECONDS);

  const newSession = await runInsertQuery(token, userId, expiresAt);
  return newSession;

  async function runInsertQuery(token, userId, expiresAt) {
    const results = await database.query({
      text: `INSERT INTO
              sessions (token, user_id, expires_at)
             VALUES
              ($1, $2, $3)
            RETURNING
              *
            ;`,
      values: [token, userId, expiresAt],
    });

    return results.rows[0];
  }
}

const session = {
  create,
  EXPIRETION_IN_MILLISECONDS,
};

export default session;
