const {hash, getUuid} = require("./util");

const addressPrefix = "ad";

const wallet = {

    isValidAddress(address) {
        return typeof address === "string" && address.length === 40 && address.startsWith(addressPrefix)
    },

    getNewAddress() {
        const t1 = Date.now();
        let address = "";
        let privateKey = "";
        while (!wallet.isValidAddress(address)) {
            privateKey = getUuid();
            address = hash(privateKey);
        }

        console.log("[wallet] Found new address in " + (Date.now() - t1) + "ms: ", address, privateKey, (address + "").length);
        return {privateKey, address};
    },

    bruteForceAddress(address) {
        let privateKey = "";
        let found = false;
        const t1 = Date.now();
        while (!found && Date.now() - t1 < 60000) {
            privateKey = getUuid();
            if (hash(privateKey) === address) {
                found = true;
            }
        }
        if (found) console.log("[wallet] Found address! ", privateKey);
        else console.log("[wallet] :(");
    }
};

module.exports = wallet;