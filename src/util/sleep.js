/**
 * author: Shawn
 * time  : 2018/2/5 9:46
 * desc  : 睡觉函数
 * update: Shawn 2018/2/5 9:46
 */

function sleep(milliseconds) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), milliseconds);
    });
}


module.exports = sleep;