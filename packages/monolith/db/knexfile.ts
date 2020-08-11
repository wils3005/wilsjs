import "knex";
import path from "path";

export const development = {
  client: "sqlite3",
  connection: {
    filename: "development.sqlite3",
  },
  useNullAsDefault: true,
};

export const test = {
  client: "sqlite3",
  connection: {
    filename: ":memory:",
  },
  seeds: {
    directory: path.join(__dirname, "seeds"),
  },
};

export const staging = {
  client: "sqlite3",
  connection: {
    filename: "staging.sqlite3",
  },
  useNullAsDefault: true,
};

export const production = {
  client: "sqlite3",
  connection: {
    filename: "production.sqlite3",
  },
  useNullAsDefault: true,
};
