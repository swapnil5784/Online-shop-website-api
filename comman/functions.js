// For make log file and print logs into it
class CommonFunctions {
    Logger(logName) {
        return require('simple-node-logger').createRollingFileLogger({
            logDirectory: 'logs',
            errorEventName: 'error',
            // fileNamePattern: '_<DATE>.log',
            fileNamePattern: logName + '_<DATE>.log',
            dateFormat: 'YYYY_MM_DD',
            timestampFormat: 'YYYY-MM-DD HH:mm:ss'
        });
    }
}
module.exports = CommonFunctions;