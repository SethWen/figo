/**
 * author: Shawn
 * time  : 5/11/18 5:51 PM
 * desc  :
 * update: Shawn 5/11/18 5:51 PM
 */

const WebSocketServer = require('../base/websocket_server');
const MiddleMan = require('../base/middle_man');
const ManagerServer = require('../manager_server');

global.adbSockets = new Map();
// global.radbSockets = new Map();

let webSocketServer = new WebSocketServer();
webSocketServer.run();
webSocketServer.setOnConnectionListener(async (socket, request) => {
    // 收到 WebSocketClient 的连接请求，创建 Agent
    let options = request.headers;
    let type = options.type;
    console.log('options -->  = ', options);
    if (type === 'adb') {
        // adb
        console.log('adb -->  = ');
        global.adbSockets.set(options.id, socket);
    } else if (type === 'radb') {
        // radb
        console.log('radb -->  = ');
        // global.radbSockets.set(options.id, socket);
        let middleMan = new MiddleMan(global.adbSockets.get(options.adbId), socket);
        await middleMan.run();
    } else {
        throw new Error('Invalid type.');
    }
});

let managerServer = new ManagerServer();
managerServer.run();