#!/usr/bin/env node

/**
 * author: Shawn
 * time  : 5/11/18 4:09 PM
 * desc  :
 * update: Shawn 5/11/18 4:09 PM
 */

const process = require('process');
const RequestUtil = require('./util/request_util');
const RadbShell = require('./radb_shell');

/*
radb list
radb -s 007 shell
radb -h
radb -version
radb connect
 */

const MANAGER_BASE_URL = process.env.npm_config_manager_base_url || process.env.MANAGER_BASE_URL || 'http://localhost:9001';


async function listShell() {
    let options = {uri: `${MANAGER_BASE_URL}/ls`};
    let shells = JSON.parse(await RequestUtil.getWithRetrySync(options));
    let str = '';
    for (let shell of shells) {
        str += `${shell}\n`;
    }
    return str.trim();
}

async function main() {
    let cmd = process.argv.splice(2);
// console.log('args -->  = ', cmd);
    switch (cmd[0]) {
        case 'ls':
            console.log(await listShell());
            break;
        case 'connect':
            let id = cmd[1];
            if (id) {
                let radbShell = new RadbShell(id);
                await radbShell.run();
            } else {
                console.log('please add add id');
            }
            break;
        case '-version':
            break;
        case '-help':
            console.log('radb help...');
            break;
        default:
            console.log('invalid command');
            break;
    }
}


if (require.main === module) {
    main();
}