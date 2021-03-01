const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "../data/data.db");

/**
 * @typedef SqlLiteDatabase
 * @type {object}
 * @property {function} prepare
 * @property {function} backup
 * @property {function(function(*)): function} transaction
 */

/**
 * @type {SqlLiteDatabase}
 */
const db = new Database(dbPath);

db.prepare(
    `CREATE TABLE IF NOT EXISTS migration
     (
         id
             INTEGER
             PRIMARY
                 KEY
             AUTOINCREMENT,
         name
             text,
         timestamp
             TIMESTAMP
             DEFAULT
                 CURRENT_TIMESTAMP
     )`
).run();

// (async () => {
//     const backupFilePath = path.join(__dirname, "../data/backup-" + Date.now() + ".db");
//     await db.backup(backupFilePath);
//     console.log("[database] Backup completed: '" + backupFilePath + "'");
// })();

const dbMigrations = path.join(__dirname, "../db-migration");
files = fs.readdirSync(dbMigrations);
files.forEach(function (filename) {
    const result = db
        .prepare("SELECT * FROM migration WHERE name=?")
        .get(filename);
    if (result === undefined) {
        console.log("[database] Run db migration: ", filename);
        require(path.join(dbMigrations, filename)).call(this, db);
        db.prepare("INSERT INTO migration (name) values (?);").run(filename);
    }
});

module.exports = db;