import knex from "../knex";
import o from "objection";

o.Model.knex(knex);

interface Session {
  id: string;
  user_id: string;
  sess: string;
  expired: Date;
}

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
