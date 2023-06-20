//simple node logger usage as function and export
const SimpleNodeLogger = require('simple-node-logger');
const opts = {
    logDirectory: 'logs',
    errorEventName: 'error',
    fileNamePattern: '_<HOUR>.log',
    dateFormat: 'YYYY_MM_DD',
    timestampFormat: 'YYYY-MM-DD HH:mm:ss'
};

const log = SimpleNodeLogger.createSimpleLogger(opts);

module.exports = log;