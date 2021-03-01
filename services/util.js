const sha1 = require("js-sha1");
const uuidv4 = require('uuid').v4;
const readline = require("readline");

let readlineInterface = undefined;

const util = {
    hash(content) {
        return sha1(content);
    },
    getUuid() {
        return uuidv4();
    },
    async readConsoleValues(keyQuestionPairs) {
        const result = {};
        if (!readlineInterface) {
            readlineInterface = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
        }
        for (const key in keyQuestionPairs) {
            if (keyQuestionPairs.hasOwnProperty(key)) {
                result[key] = await util.readConsoleValue(keyQuestionPairs[key]);
            }
        }
        readlineInterface.close();
        return result;
    },
    readConsoleValue(question) {
        return new Promise((resolve) => {
            readlineInterface.question(question, function (value) {
                resolve(value);
            });
        });
    }
};

module.exports = util;