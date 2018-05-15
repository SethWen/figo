/**
 * author: Shawn
 * time  : 2018/4/11 18:36
 * desc  : Shell Executor
 * update: Shawn 2018/4/11 18:36
 */


const {spawn, exec} = require('child_process');
const os = require('os');


/**
 * 如果 shell 命令执行后，有多条日志，则用该方法执行，因为 onData() 一次只能回调一行
 */
class AbsShell {

    constructor(script) {
        this.script = script;
    }


    execute() {
        let systemType = os.type().toLowerCase();

        let shellScrip;
        if (systemType.match(/windows/g)) { // windows
            shellScrip = spawn('cmd.exe', ['/c', `${this.script}`]);
        } else if (systemType.match(/linux/g)) { // linux
            shellScrip = spawn('sh', ['-c', `${this.script}`]);
        } else if (systemType.match(/darwin/g)) { // mac
            // todo 2018/4/4 18:40 未测试
            shellScrip = spawn('sh', ['-c', `${this.script}`]);
        } else {
            throw new Error('Invalid os type.');
        }

        shellScrip.stdout.on('data', this.onStdOut.bind(this));
        shellScrip.stderr.on('data', this.onStdError.bind(this));
        shellScrip.on('close', this.onClose.bind(this));
    }


    onStdOut(data) {
    }


    onStdError(data) {
    }


    onClose(code) {
    }
}


/**
 * 如果 shell 命令执行后，只有一条日志，则用该方法执行
 *
 * @param script
 * @returns {Promise<String>}
 */
async function executeSync(script) {
    return new Promise((resolve, reject) => {
        let systemType = os.type().toLowerCase();

        let shellScrip;
        if (systemType.match(/windows/g)) {         // windows
            shellScrip = spawn('cmd.exe', ['/c', `${script}`]);
        } else if (systemType.match(/linux/g)) {    // linux
            // shellScrip = spawn('sh', ['-c', `node --version`]);
            // shellScrip = spawn('sh', ['-c', `${script}`]);
            shellScrip = exec(`${script}`);
        } else if (systemType.match(/darwin/g)) {   // mac
            // todo 2018/4/4 18:40 未测试
            shellScrip = spawn('sh', ['-c', `${script}`]);
        } else {
            throw new Error('Invalid os type.');
        }

        shellScrip.stdout.on('data', (data) => {
            resolve(data.toString());
        });

        shellScrip.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            resolve(data.toString());
        });

        shellScrip.on('close', (code) => {
            console.log(`Execute "${script}" finished and process exited with code ${code}`);
            resolve(code);
        });
    })
}


async function findPidByPort(port) {
    let systemType = os.type().toLowerCase();

    let pid;
    if (systemType.match(/windows/g)) {         // windows
        let ret = await executeSync(`netstat -ano | findstr 0.0.0.0:${port}`);
        if (ret) {
            try {
                let split = ret.split(/\s+/g);
                pid = split[split.length - 1]; // 获取该端口对应的 pid
            } catch (error) {
                console.error(error);
            }
        }
    } else if (systemType.match(/linux/g)) {    // linux
        let ret = await executeSync(`lsof -i:${port}`);
        if (ret) {
            try {
                let processInfo = ret.split('\n')[1];
                pid = processInfo.split(/\s+/g)[1];
            } catch (error) {
                console.error(error);
            }
        }
    } else if (systemType.match(/darwin/g)) {   // mac
        // todo 2018/4/4 18:40 未测试
        let ret = await executeSync(`lsof -i:${port}`);
        if (ret) {
            try {
                let processInfo = ret.split('\n')[1];
                pid = processInfo.split(/\s+/g)[1];
            } catch (error) {
                console.error(error);
            }
        }
    } else {
        throw new Error('Invalid os type.');
    }
    console.log(`Port ${port} is occupied by process ${pid}`);
    return pid;
}


async function killProcessByPid(pid) {
    let systemType = os.type().toLowerCase();

    if (systemType.match(/windows/g)) {         // windows
        await executeSync(`taskkill /f /pid ${pid}`);
    } else if (systemType.match(/linux/g)) {    // linux
        await executeSync(`kill -9 ${pid}`);
    } else if (systemType.match(/darwin/g)) {   // mac
        // todo 2018/4/4 18:40 未测试
        await executeSync(`kill -9 ${pid}`);
    } else {
        throw new Error('Invalid os type.');
    }
}


// (async function () {
//     // let ret = await executeSync('echo $JAVA_HOME');
//     // let ret = await executeSync('cat package.json');
//     let ret = await executeSync('vim --not-a-term  package.json');
//
//     console.log('ret --> ret = ', ret);
// })();

module.exports = {
    AbsShell: AbsShell,
    executeSync: executeSync,
    findPidByPort: findPidByPort,
    killProcessByPid: killProcessByPid,
};