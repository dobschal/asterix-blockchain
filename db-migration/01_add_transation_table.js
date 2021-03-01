module.exports = function (db) {
    const stmt = db.prepare(`
        CREATE TABLE IF NOT EXISTS \`transaction\`
        (
            id           VARCHAR(255) PRIMARY KEY,
            timestamp    INTEGER,
            from_address VARCHAR(255),
            to_address   VARCHAR(255),
            amount       INTEGER,
            gas          INTEGER,
            meta         TEXT,
            block_id     INTEGER,
            status       VARCHAR(255)
        )`);
    return stmt.run();
};
