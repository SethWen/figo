/**
 * author: Shawn
 * time  : 5/11/18 6:04 PM
 * desc  :
 * update: Shawn 5/11/18 6:04 PM
 */


const BaseClient = require('../../base/base_client');

class AdbShell extends BaseClient {

    constructor() {
        super();
        this.type = 'adb';
        this.adbId = '007'
    }


    async webSocketMessageHandler(message) {
        await super.webSocketMessageHandler(message);
        console.log('webSocketMessageHandler --> msg = ', message);
        // log.info(`WebSocketClient receive message: ${message}`);
        let msgObj = JSON.parse(message);
        // let eventType = msgObj['eventType'];
        // let data = msgObj['data'];
        this.send({correlationId: msgObj['correlationId'], data: 'received: ' + msgObj['data']});
    }
}

new AdbShell().run();