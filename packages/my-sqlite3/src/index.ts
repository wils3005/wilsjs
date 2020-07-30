import * as faker from "faker";
import * as uuid from "uuid";
import { Database, RunResult, Statement } from "sqlite3";

type Person = Record<string, string>;

const db = new Database(":memory:");

function handleRunResult(this: RunResult, err: Error | null) {
  console.error({ this: this, err });
}

function handleStatement(this: Statement, err: Error | null) {
  console.error({ this: this, err });
}

function handleError(err: Error) {
  console.error({ err });
}

db.serialize(() => {
  const sql = `
    CREATE TABLE IF NOT EXISTS people(
      id TEXT PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      country_code TEXT,
      state TEXT,
      street_address TEXT,
      zip TEXT,
      phone_number TEXT
    ) WITHOUT ROWID;
  `;

  db.run(sql, handleRunResult);
  const statement = db.prepare(
    "INSERT INTO people VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    handleStatement
  );

  for (let i = 0; i < 10; i++) {
    const params = [
      uuid.v4(),
      faker.name.firstName(),
      faker.name.lastName(),
      "US",
      faker.address.stateAbbr(),
      faker.address.streetAddress(),
      faker.address.zipCode(),
      faker.phone.phoneNumber(),
    ];

    statement.run(params, handleRunResult);
  }

  statement.finalize(handleError);

  db.each("SELECT * FROM people", (err, row: Person) => {
    err ? console.error({ err }) : console.info(row);
  });
});

db.close((err: Error | null) => {
  console.error({ err });
});
