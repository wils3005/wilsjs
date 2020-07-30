import { Database } from "sqlite3";

const db = new Database(":memory:");

if (db instanceof Database) {
  db.serialize(function () {
    db.run("CREATE TABLE lorem (info TEXT)");
    let stmt = db.prepare("INSERT INTO lorem VALUES (?)");

    for (const i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
    }

    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
      console.log(row.id + ": " + row.info);
    });
  });

  db.close();
}
