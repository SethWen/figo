var log = require('./log');

module.exports = {
    success: function (res, obj) {
        res.status(200);
        res.header('Access-Control-Allow-Origin', '*'); // allow AJAX from any origin
        if (!obj) {
            res.end();
            return;
        }

        if (obj instanceof Object) {
            res.json(obj);
        } else {
            res.header('Content-Type', 'text/plain; charset=UTF-8');
            res.write(obj);
        }
        res.end();
    },

    error: function (req, res, msg, statusCode) {
        res.header('Access-Control-Allow-Origin', '*'); // allow AJAX from any origin
        let status = statusCode ? statusCode : 400;   // default 400
        res.status(status);
        if (typeof(msg) === 'object') {
            log.error(`Request error for ${req.url} : ${JSON.stringify(msg)}`);
            res.json(msg);
        } else if (typeof(msg) === 'string') {
            log.error(`Request error for ${req.url} : ${msg}`);
            res.header('Content-Type', 'text/plain;charset=UTF-8');
            res.write(msg);
        } else {
            log.error(`Error msg ${msg} should be an object `);
            res.status(500);
            res.json('inner error');
        }
        res.end();
    }
};