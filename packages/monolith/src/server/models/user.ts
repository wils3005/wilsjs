import * as z from "zod";
import knex from "../knex";
import o from "objection";

o.Model.knex(knex);

interface User {
  id: string;
  username: string;
  password: string;
}

// const zodObject = z.object({
//   id: z.string(),
//   username: z.string(),
//   password: z.string()
// });

class User extends o.Model {
  static tableName = "users";

  // static relationMappings = {
  //   children: {
  //     relation: o.Model.HasManyRelation,
  //     modelClass: Patient,
  //     join: {
  //       from: "persons.id",
  //       to: "persons.parentId",
  //     },
  //   },
  // };
}

export default User;
