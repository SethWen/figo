/**
 * author: Shawn
 * time  : 2018/3/16 16:15
 * desc  :
 * update: Shawn 2018/3/16 16:15
 */

const EventEmitter = require('events');
const {Server} = require('ws');
const log = require('../util/log');
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

    constructor() {
        super();
        this.port = 8080;
        this.server = new Server({
            port: this.port,
            perMessageDeflate: {
                zlibDeflateOptions: { // See zlib defaults.
                    chunkSize: 1024,
                    memLevel: 7,
                    level: 3,
                },
                zlibInflateOptions: {
                    chunkSize: 10 * 1024
                },
                // Other options settable:
                clientNoContextTakeover: true, // Defaults to negotiated value.
                serverNoContextTakeover: true, // Defaults to negotiated value.
                clientMaxWindowBits: 10,       // Defaults to negotiated value.
                serverMaxWindowBits: 10,       // Defaults to negotiated value.
                // Below options specified as default values.
                concurrencyLimit: 10,          // Limits zlib concurrency for perf.
                threshold: 1024,               // Size (in bytes) below which messages
                                               // should not be compressed.

            },
            clientTracking: true,
            // path: 'bordeaux',
            verifyClient: (info, cb) => {
                // let token = info.req.headers.token;
                // let agent = info.req.headers.hostname;
                let headers = info.req.headers;
                log.info(`headers from WebSocketClient is ${JSON.stringify(headers)}`);
                checkToken(headers, (isValid) => {
                    cb(isValid);
                })
            }
        });
    }


    run() {
        this.server.on('error', (error) => {
            log.error(`WebSocketServer error: ${error}`);
        });

        this.server.on('headers', (headers, request) => {
            log.info(`WebSocketServer headers: ${headers}`);
        });

        this.server.on('listening', () => {
            log.info(`WebSocketServer is established and listening on port ${this.port}`);
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