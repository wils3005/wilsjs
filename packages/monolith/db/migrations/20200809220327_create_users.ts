import Knex from "knex";

const tableName = "users";

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(tableName, (table) => {
    table.string("id").primary();
    table.string("username").unique().notNullable();
    table.string("password").notNullable();
    table.timestamps(true, true);
  });
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable(tableName);
}
