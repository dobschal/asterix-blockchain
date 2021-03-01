module.exports = function (db) {
    const stmt = db.prepare(`
        CREATE TABLE IF NOT EXISTS block
        (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp INTEGER,
            signature VARCHAR(255),
            nonce     INTEGER,
            verifier  VARCHAR(255)
        )`);
    return stmt.run();
};
