const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

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

    isValidObjectId(Id) {
        if (ObjectId.isValid(Id)) {
            return true
        }
        return false
    }



}
module.exports = CommonFunctions;