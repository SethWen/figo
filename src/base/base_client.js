/**
 * author: Shawn
 * time  : 2018/3/26 17:58
 * desc  : 本地爬虫 client 基类，主要包含 WebSocketClient 和 CrawlerDispatcher
 * update: Shawn 2018/3/26 17:58
 */


const WebSocket = require('ws');
const EventEmitter = require('events');
const os = require('os');
const process = require('process');
const WebSocketEvent = require('../constant/websocket_event');
const DigestUtil = require('../util/digest_util');
const sleep = require('../util/sleep');
const uuid = require('../util/uuid');


class BaseLocalClient extends EventEmitter {


    constructor() {
        super();
        this.type = null;
        this.devices = null;
        this.agentName = null;

        this.responseResolves = new Map();
    }


    async createConnection() {
        let ret = await this.connect();
        while (ret !== 1) { // 如果未连接上，每隔 3s 进行重连接
            console.log('createConnection -->  = ');
            ret = await this.connect();
            await sleep(3000);
        }
    }


    async connect() {
        let host = 'localhost';
        let port = '8080';
        let uri = `ws://${host}:${port}`;
        let stamp = Date.now();
        // sign = md5(`${webSocketConfig.cipher}${os.hostname()}${type}${process.pid}${stamp}`)
        // let token = DigestUtil.str2md5(`${webSocketConfig.cipher}${os.hostname()}${this.type}${process.pid}${stamp}`);
        // console.log(`connecting... token: ${token}`);
        // todo 5/15/18 3:37 PM
        let token = 'hahah';
        // 此处可能重复执行，所以在设置监听前先移除所有
        this.once('close', this.onClose.bind(this));

        return new Promise(async (resolve, reject) => {
            delete this.client; // 清除后重新初始化
            this.client = new WebSocket(
                uri,
                {
                    perMessageDeflate: false,
                    headers: {
                        id: this.adbId,
                        token: token,
                        hostname: os.hostname(),
                        type: this.type,
                        pid: process.pid,
                        stamp: stamp,
                        agentname: this.agentName,  // !!! headers 传输时，会将所有字段名称转成小写
                    }
                }
            );

            this.client.on('open', async () => {
                console.log(`WebSocket Client onOpen: ${this.client.readyState}`);
                resolve(1)
            });

            this.client.on('error', async (error) => {
                if (this.isFirst) {
                    console.error(`WebSocket Client onError: ${error}`);
                    resolve(-1);
                } else { // socket 重连接机制
                    await this.run();
                    resolve();
                }
            });


            this.client.on('close', async (code, reason) => {
                this.emit('close');
                if (this.isFirst) {
                    console.error(`WebSocket Client onClose: ${reason}`);
                    resolve(-1);
                } else { // socket 重连接机制
                    await this.run();
                    resolve();
                }
            });

            this.client.on('message', this.webSocketMessageHandler.bind(this));

            this.client.on('ping', (data) => {
                console.log(`WebSocket Client onPing: ${data}`);
            });

            this.client.on('pong', (data) => {
                console.log(`WebSocket Client onPong: ${data}`);
            });
        });
    }


    async run() {
        this.isFirst = true;
        await this.createConnection();
        this.isFirst = false;
    }


    async onClose() {
    }


    /**
     * execute after corresponding agent created at remote agent manager
     *
     * @returns {Promise<void>}
     */
    async onAgentCreate() {
    }


    async webSocketMessageHandler(message) {


        // let resolve = this.responseResolves.get(msgObj['correlationId']);
        // if (resolve) {
        //     resolve(msgObj['code']);
        //     this.responseResolves.delete(msgObj['correlationId']);
        // }

        // switch (eventType) {
        //     case WebSocketEvent.CRAWL_RESULT:
        //         let resolve = this.responseResolves.get(msgObj['correlationId']);
        //         if (resolve) {
        //             resolve(msgObj['code']);
        //             this.responseResolves.delete(msgObj['correlationId']);
        //         }
        //         break;
        //     case WebSocketEvent.CREATE_AGENT:
        //         this.agentId = data['agentId'];
        //         console.log(`An agent is created on the remote, which agentId is ${this.agentId}`);
        //         await this.onAgentCreate();
        //         break;
        //     case WebSocketEvent.NEW_TASK:
        //         this.send({
        //             eventType: WebSocketEvent.NEW_TASK,
        //             code: 200,
        //             correlationId: msgObj['correlationId'],
        //         });
        //
        //         await this.dispatchTask(data);
        //         break;
        //     case WebSocketEvent.RESTART:
        //         process.exit(); // process exit, and then pm2 restart it
        //         break;
        //     default:
        //         break;
        // }
    }


    /**
     * 子类重写该方法
     *
     * @param data
     * @returns {Promise<void>}
     */
    async dispatchTask(data) {
    }


    generateWebSocketMessage(eventType, data) {
        return {
            eventType: eventType,
            data: data,
        };
    }


    send(msg) {
        if (typeof(msg) === 'object') msg = JSON.stringify(msg);

        this.client.send(msg);
    }


    async sendForResponse(body) {
        body.correlationId = uuid();
        this.send(body);

        return new Promise((resolve, reject) => {
            this.responseResolves.set(body.correlationId, resolve);
        })
    }
}


module.exports = BaseLocalClient;