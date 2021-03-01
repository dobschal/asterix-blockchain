const blockService = require("../services/block");

module.exports = function (db) {

    const stmt1 = db.prepare(`
        INSERT INTO "transaction" (id, timestamp, to_address, amount, gas, meta, status)
        values ('c5e39d79-d373-4d33-8e9a-2b058064adfe', 0, 'adcee63730720fb74965d369f9ba4746e8169916', 5000, 0,
                'VERIFIER_REWARD', 'OPEN');
    `);
    stmt1.run();

    const transactions = db
        .prepare("SELECT * FROM `transaction` WHERE status='open' ORDER BY timestamp ASC LIMIT 10")
        .all();
    const {signature, nonce} = blockService.getBlockContentSignature(transactions);

    const stmt2 = db.prepare(`
        INSERT INTO block (timestamp, signature, nonce, verifier)
        values (0, ?, ?, 'adcee63730720fb74965d369f9ba4746e8169916');
    `);
    const {lastInsertRowID} = stmt2.run(signature, nonce);

    const stmt3 = db.prepare(`
        UPDATE "transaction"
        SET block_id=?,
            status='confirmed'
        where id = 'c5e39d79-d373-4d33-8e9a-2b058064adfe';
    `);
    stmt3.run(lastInsertRowID);
};