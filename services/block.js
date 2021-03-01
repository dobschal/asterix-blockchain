const dbService = require("./database");
const {readConsoleValues, hash, getUuid} = require("./util");
const {isValidAddress} = require("./wallet");

const blockSignaturePrefix = "666ccc";

const block = {

    isValidSignature(signature) {
        return typeof signature === "string" && signature.length === 40 && signature.startsWith(blockSignaturePrefix);
    },

    getBlockContentSignature(transactions) {
        const blockContent = JSON.stringify(transactions);
        let signature = "";
        let nonce = 0;
        const t1 = Date.now();
        while (!block.isValidSignature(signature) && Date.now() - t1 < 60000) {
            nonce++;
            signature = hash(blockContent + nonce);
        }
        console.log(`
Verified Block in ${Math.floor((Date.now() - t1) / 1000)} seconds!
    Signature: ${signature}
    Nonce: ${nonce}
    Transactions: ${transactions.length}
`);
        return {nonce, signature};
    },

    async verify() {
        let verifierAddress;
        try {
            const result = await readConsoleValues({
                verifier: "Please enter your wallet address to retrieve the gas.\n"
            });
            verifierAddress = result.verifier;
        } catch (e) {
            console.error(e);
            return;
        }
        if (!isValidAddress(verifierAddress)) {
            console.error("Verifier wallet address is invalid.");
            return;
        }
        const transactions = dbService
            .prepare("SELECT * FROM `transaction` WHERE status='open' ORDER BY timestamp ASC LIMIT 10")
            .all();
        block.getBlockContentSignature(transactions);

        // TODO: add reward transaction and last block signature...

    }
};

module.exports = block;