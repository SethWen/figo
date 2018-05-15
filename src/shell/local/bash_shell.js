/**
 * author: Shawn
 * time  : 5/11/18 11:16 PM
 * desc  :
 * update: Shawn 5/11/18 11:16 PM
 */

const BaseClient = require('../../base/base_client');
const ShellUtil = require('../../util/shell_util');

class BashShell extends BaseClient {

    constructor(host, port) {
        super(host, port);
        this.type = 'local';
        this.adbId = '008'
    }


    async webSocketMessageHandler(message) {
        await super.webSocketMessageHandler(message);
        console.log('webSocketMessageHandler --> msg = ', message);
        // log.info(`WebSocketClient receive message: ${message}`);
        let msgObj = JSON.parse(message);
        // let eventType = msgObj['eventType'];
        // let data = msgObj['data'];
        let ret = await ShellUtil.executeSync(msgObj['data']);
        this.send({correlationId: msgObj['correlationId'], data: ret});
    }
}

new BashShell('localhost', 9125).run();

