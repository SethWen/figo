/**
 * author: Shawn
 * time  : 5/15/18 4:48 PM
 * desc  :
 * update: Shawn 5/15/18 4:48 PM
 */

const process = require('process');
const BaseClient = require('../../base/base_client');


class Rshell {

    constructor(host, port) {
        this.host = host;
        this.port = port;

        this.type = 'remote';
    }

    async run() {
        while (true) {
            process.stdout.write('radb-shell > ');
            let cmd = await this.readLine();

            console.log(cmd);
            if (cmd === 'exit' || cmd === 'quit') {
                process.exit(0);
            }

            if (cmd === 'connect') {
                await this.connect();
            }

            process.stdout.write(cmd);
        }
    }


    async connect() {
        this.client = new BaseClient(this.host, this.port, '008');
        // fixme 5/15/18 5:37 PM 传入 type
        await this.client.run();
    }


    async terminate() {

    }

    async readLine() {
        return new Promise((resolve, reject) => {
            process.stdin.once('data', (data) => resolve(data.toString().trim()));
        })
    }
}

new Rshell('localhost', 9125).run();