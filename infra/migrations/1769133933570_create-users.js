require("os");

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    // For reference, GitHub limits username to 39 characters.
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    // Why 254 in length? Maximum number of characters an email can have.
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    // Why 60 characters? Because that's the maximum number of characters allowed by BCrypt.
    password: {
      type: "varchar(60)",
      notNull: true,
    },

    // Always use timestamp with timezone? https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};
exports.down = false;
