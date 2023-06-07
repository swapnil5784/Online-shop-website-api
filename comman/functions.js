module.exports = {
    Logger: (logName) => {
        return require('simple-node-logger').createRollingFileLogger({
            logDirectory: 'logs',
            errorEventName: 'error',
            fileNamePattern: logName + '_<DATE>.log',
            dateFormat: 'YYYY_MM_DD',
            timestampFormat: 'YYYY-MM-DD HH:mm:ss'
        });
    }
}        