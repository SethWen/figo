/**
 * author: Shawn
 * time  : 5/14/18 4:54 PM
 * desc  :
 * update: Shawn 5/14/18 4:54 PM
 */

const config = require('config');
const restify = require('restify');
const log = require('./util/log');
const response = require('./util/response');


class ManagerServer {
    constructor() {
        this.server = restify.createServer({
            name: `ManagerServer`,
            log: log
        });
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
        let port = config.get('managerServer').port;
        this.server.listen(port, () => {
            log.info(`adb manager is listening on port ${port}`);
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


module.exports = ManagerServer;