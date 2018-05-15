/**
 * author: Shawn
 * time  : 18-5-4 下午3:52
 * desc  : request 封装
 * update: Shawn 18-5-4 下午3:52
 */

const request = require('request');
const sleep = require('./sleep');


async function requestSync(options) {
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                resolve(-1);
            }
        });
    });
}


async function requestWithRetrySync(options, retryTimes = 3) {
    for (let i = 0; i < retryTimes; i++) {
        let body = await requestSync(options);
        if (body !== -1) return body;
        await sleep(500);
    }
    return -1;
}


async function getWithRetrySync(options, retryTimes = 3) {
    options.method = 'GET';
    return requestWithRetrySync(options, retryTimes);
}

async function postWithRetrySync(options, retryTimes = 3) {
    options.method = 'post';
    return requestWithRetrySync(options, retryTimes);
}


module.exports = {
    requestSync: requestSync,
    requestWithRetrySync: requestWithRetrySync,
    getWithRetrySync: getWithRetrySync,
    postWithRetrySync: postWithRetrySync,
};
