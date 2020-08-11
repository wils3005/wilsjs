import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import * as z from "zod";
import Knex from "knex";

const { PASSWORD, USERNAME } = process.env;
const username = z.string().parse(USERNAME);
const password = z.string().parse(PASSWORD);

export async function seed(knex: Knex): Promise<number[]> {
  return knex("users")
    .del()
    .then(async () =>
      knex("users").insert([
        {
          id: uuid.v4(),
          username,
          password: await bcrypt.hash(password, 10),
        },
      ])
    );
}
