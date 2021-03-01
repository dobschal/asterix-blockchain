const dbService = require("./database");
const {readConsoleValues, hash, getUuid} = require("./util");
const {isValidAddress} = require("./wallet");

const transactionService = {

    async addTransaction() {
        let transaction;
        try {
            transaction = await readConsoleValues({
                from_address: "Please enter your wallet enter to send from.\n",
                private_key: "Please enter your private key.\n",
                to_address: "Please enter the destination wallet address.\n",
                amount: "Please enter the amount to send.\n",
                gas: "How much gas do you want to pay?\n",
                meta: "Some additional info you want to store with this transaction?\n"
            });
        } catch (e) {
            console.error(e);
            return;
        }

        transaction.amount = Number(transaction.amount);
        transaction.gas = Number(transaction.gas);
        transaction.timestamp = Date.now();
        transaction.status = "open";
        transaction.id = getUuid();

        try {
            transactionService.isValidTransaction(transaction);
        } catch (e) {
            console.error("Error on transaction validation: ", e.message);
            return;
        }

        const result = dbService
            .prepare(`
                INSERT INTO transaction (id, from_address, to_address, amount, gas, meta, timestamp, status)
                VALUES (@id, @from_address, @to_address, @amount, @gas, @meta, @timestamp, @status);
            `)
            .run(transaction);

        if (result.changes <= 0) {
            console.error("Inserting transaction failed!");
            return;
        }

        console.log(`
Your transaction was added successfully:
    Your transaction ID is: ${transaction.id}
`);
    },

    isValidTransaction(transaction) {
        if (!Number.isInteger(transaction.amount) || transaction.amount <= 0) throw new Error("Amount needs to be a number greater 0");
        if (!Number.isInteger(transaction.gas) || transaction.gas < 0) throw new Error("Amount needs to be a number equal or greater 0");
        if (transaction.private_key && hash(transaction.private_key) !== transaction.from_address) throw new Error("Private key is wrong.");
        if (!isValidAddress(transaction.from_address)) throw new Error("Sender wallet address is invalid.");
        if (!isValidAddress(transaction.to_address)) throw new Error("Recipient wallet address is invalid.");

        // TODO: Check if user has enough balance...

    }

};
module.exports = transactionService;