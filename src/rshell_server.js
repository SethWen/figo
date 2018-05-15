/**
 * author: Shawn
 * time  : 5/14/18 4:54 PM
 * desc  :
 * update: Shawn 5/14/18 4:54 PM
 */

const restify = require('restify');
const response = require('./util/response');
const WebSocketServer = require('./base/websocket_server');
const MiddleMan = require('./base/middle_man');

global.adbSockets = new Map();

class ManagerServer {
    constructor() {
        this.server = restify.createServer({
            name: `RshellServer`,
            // log: log
        });

        this.webSocketServer = new WebSocketServer(this.server);
    }


    run() {
        this.server.pre((req, res, next) => {
            res.charSet('utf-8');
            next()
        });

        this.server.use(restify.plugins.queryParser({mapParams: true}));  // req.query has the query
        this.server.use(restify.plugins.bodyParser({     // parses json/x-www-form-urlencoded data to req.params
            maxBodySize: 5120,
            mapParams: true,
            mapFiles: false,
            overrideParams: false
        }));

        this.server.get('/ls', this.listShell.bind(this));


        this.server.server.setTimeout(0);

        // todo 5/15/18 3:37 PM
        let port = 9125;
        this.server.listen(port, () => {
            console.log(`adb manager is listening on port ${port}`);
        });

        this.webSocketServer.run();
        this.webSocketServer.setOnConnectionListener(async (socket, request) => {
            // 收到 WebSocketClient 的连接请求，创建 Agent
            let options = request.headers;
            let type = options.type;
            console.log('options -->  = ', options);
            if (type === 'local') {
                console.log('local -->  = ');
                global.adbSockets.set(options.id, socket);
            } else if (type === 'remote') {
                // radb
                console.log('remote -->  = ');
                // global.radbSockets.set(options.id, socket);
                let middleMan = new MiddleMan(global.adbSockets.get(options.adbId), socket);
                await middleMan.run();
            } else {
                throw new Error('Invalid type.');
            }
        });
    }


    async listShell(req, res, next) {
        let shells = [];
        // console.log('listShell --> global = ', global.adbSockets);
        for (let [k, v] of global.adbSockets) {
            shells.push(k);
        }
        console.log('listShell --> shells = ', shells);
        response.success(res, shells);
    }
}

let managerServer = new ManagerServer();
managerServer.run();

module.exports = ManagerServer;