// packages
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
// crypto
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

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
            return true;
        }
        return false;
    }

    encrypt(data, key, iv) {
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    }

    decrypt(data, key, iv) {
        let iv2 = Buffer.from(iv, 'hex');
        let encryptedText = Buffer.from(data, 'hex');
        let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv2);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    sendSuccessResponse(res, message, data) {
        if (data) {
            return res.json({
                type: "success",
                status: 200,
                message: message,
                data: data
            })
        }
        return res.json({
            type: "success",
            status: 200,
            message: message,
        })
    }

    sendErrorResponse(res, status, message) {
        return res.json({
            type: "error",
            status: status,
            message: message
        })
    }

}
module.exports = CommonFunctions;