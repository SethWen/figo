'use strict';

const PREFIX = 'all_in_one';

/**
 * 获取日志后缀：当前日期字符串(格式：20170901)
 */
function postfix() {
    var now = new Date();
    var date = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    return date;
}

/**
 * 获取日志文件名称
 */
function logName() {
    return PREFIX + '_' + postfix() + '.log';
}

module.exports = {
    PREFIX: PREFIX,
    postfix: postfix,
    logName: logName
}

