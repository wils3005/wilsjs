import * as z from "zod";
import Knex from "knex";
import path from "path";

const filename = path.join(
  process.cwd(),
  "db",
  `${z.string().parse(process.env.NODE_ENV)}.sqlite3`
);

const knex = Knex({
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename,
  },
});

export default knex;
