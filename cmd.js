const {getNewAddress, bruteForceAddress} = require("./services/wallet");
const {addTransaction} = require("./services/transaction");
const {verify} = require("./services/block");

const cmd = {

    help() {
        console.log("\t - " + Object
            .keys(cmd)
            .filter(name => !name.startsWith("_") && typeof cmd[name] === "function" && name !== "help")
            .map(name => {
                switch (name) {
                    case "init":
                        return "init (Runs this first)";
                    case "at":
                        return "at \t(Add transaction)";
                    case "bfw":
                        return "bfw \t(Brute Force Wallet to get the private of an address)";
                    case "cw":
                        return "cw \t(Create Wallet and get address)";
                    case "v":
                        return "v \t(Verify next block. 'Mining'...)"
                    default:
                        return name;
                }
            })
            .join("\n\t - "));
    },

    init() {
        console.log("Application ready to use.");
    },

    async v() {
        await verify();
    },

    async at() {
        await addTransaction();
    },

    /**
     * Brute force a wallet address. Has an internal timeout.
     * @param {string} address
     */
    bfw(address) {
        bruteForceAddress(address);
    },

    /**
     *  Create Wallet
     */
    cw() {
        let {address, privateKey} = getNewAddress();
        console.log(`
Your new wallet:
    Address: ${address}
    Private Key: ${privateKey}
    
Keep the private key secure!

        `);
    },

    _run() {
        const myArgs = process.argv.slice(2);
        const methodName = myArgs[0];
        if (typeof cmd[methodName] !== "function") {
            return console.error(`Method '${methodName}' does not exist.`);
        }
        cmd[methodName].apply(null, myArgs.splice(1));
    }
};

cmd._run();