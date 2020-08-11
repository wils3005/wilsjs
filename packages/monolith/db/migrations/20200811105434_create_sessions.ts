import Knex from "knex";

const tableName = "sessions";

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(tableName, (table) => {
    table.string("id").primary();
    table.string("user_id").index().notNullable();
    table.string("sess");
    table.timestamp("expired");
    table.timestamps(true, true);
  });
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable(tableName);
}
