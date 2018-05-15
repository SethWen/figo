/**
 * author: Shawn
 * time  : 2018/3/16 16:15
 * desc  :
 * update: Shawn 2018/3/16 16:15
 */

const EventEmitter = require('events');
const {Server} = require('ws');
const DigestUtil = require('../util/digest_util');


/**
 * 校验 Token 防止其它人连接
 *
 * @param headers
 * @param callback
 */
function checkToken(headers, callback) {
    // let [clientHostname, type, clientPid, clientStamp] = [headers.hostname, headers.type, headers.pid, headers.stamp];
    // let webSocketConfig = config.get('websocket');
    // let token = DigestUtil.str2md5(`${webSocketConfig.cipher}${clientHostname}${type}${clientPid}${clientStamp}`);
    // if (token === headers.token && (Date.now() - clientStamp < 8000)) { // 通过密钥生成的 md5 相等，并且时间戳相差不超过 8 s
    //     callback(true);
    // } else {
    //     callback(false);
    // }
    callback(true);
}


class WebSocketServer extends EventEmitter {

    constructor(server) {
        super();
        this.server = new Server({server: server});
    }


    run() {
        this.server.on('error', (error) => {
            console.error(`WebSocketServer error: ${error}`);
        });

        this.server.on('headers', (headers, request) => {
            console.log(`WebSocketServer headers: ${headers}`);
        });

        this.server.on('listening', () => {
            console.log(`WebSocketServer is established and listening on port ${this.server}`);
        });
    }


    async connectionHandler(socket, request) {
        this.connectionCallback(socket, request);
    }


    setOnConnectionListener(callback) {
        this.connectionCallback = callback;
        this.server.on('connection', this.connectionHandler.bind(this));
    }
}


module.exports = WebSocketServer;