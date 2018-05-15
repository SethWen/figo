/**
 * author: Shawn
 * time  : 5/11/18 6:15 PM
 * desc  :
 * update: Shawn 5/11/18 6:15 PM
 */


class MiddleMan {

    constructor(adbSocket, radbSocket) {
        // this.agentId = `${os.hostname()}_${options.hostname}_${options.type}_${options.pid}`;
        this.adbSocket = adbSocket;
        this.radbSocket = radbSocket;
    }


    async run() {
        this.radbSocket.on('message', this.radbShellMessageHandler.bind(this));
        this.adbSocket.on('message', this.adbShellMessageHandler.bind(this));

        console.log('run --> middle man created = ');
    }


    adbShellMessageHandler(msg) {
        this.radbSocket.send(msg['data']);
    }

    radbShellMessageHandler(msg) {
        this.adbSocket.send(msg);
    }


    sendToAdbShell(msg) {
        // this.radbSocket.send(msg);
    }

    sendToRadbShell() {
    }
}


module.exports = MiddleMan;