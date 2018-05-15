/**
 * author: Shawn
 * time  : 2018/3/6 17:49
 * desc  :
 * update: Shawn 2018/3/6 17:49
 */

const uuid = require('uuid');

module.exports = function() {
    return uuid().replace(/-/g, '');
};