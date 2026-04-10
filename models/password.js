import bcryptjs from "bcryptjs";

async function hash(password) {
  const peeper = process.env.PASSWORD_PEEPER;
  const passwordWithPeeper = password + peeper

  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(passwordWithPeeper, rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "producton" ? 14 : 1;
}

async function compare(providedPassword, storedPassword) {
  return await bcryptjs.compare(providedPassword + process.env.PASSWORD_PEEPER, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
