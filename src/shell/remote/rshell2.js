/**
 * author: Shawn
 * time  : 5/11/18 5:57 PM
 * desc  :
 * update: Shawn 5/11/18 5:57 PM
 */


const process = require('process');
const readline = require('readline');

const BaseClient = require('../../base/base_client');


SHELL_STATUS = true;

async function readLine() {
    const stdio = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve, reject) => {
        stdio.once('line', (line) => {
            resolve(line.trim());
        });
    })
}


class Rshell2 extends BaseClient {

    constructor(adbId) {
        super();
        this.agentName = 'RadbShell';
        this.type = 'remote';
        this.adbId = adbId;
    }


    async run() {
        console.log('connecting...');
        await super.run();


        while (SHELL_STATUS) {
            process.stdout.write('radb-shell > ');
            // process.stdout.write('> ');
            let cmd = await readLine();
            if (cmd === 'exit' || cmd === 'quit') {
                process.exit(0);
            }


            if (cmd) {
                let line = await this.sendForResponse({data: cmd});
                process.stdout.write(`${line}`)
            }

        }
    }


    async webSocketMessageHandler(message) {
        await super.webSocketMessageHandler(message);
        let msgObj = JSON.parse(message);
        let resolve = this.responseResolves.get(msgObj['correlationId']);
        if (resolve) {
            resolve(msgObj['data']);
            this.responseResolves.delete(msgObj['correlationId']);
        }
    }
}


module.exports = Rshell2;