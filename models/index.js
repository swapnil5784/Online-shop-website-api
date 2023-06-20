const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs')
const basename = path.basename(module.filename)

try {
    mongoose.connect(process.env.MONGO_URL);
    const db = mongoose.connection;
    console.log(process.env.MONGO_URL)
    db.on('error', (error) => {
        console.log(error)
    });
    db.once('open', () => {
        console.log('mongodb connected of online-website!')
    })
    fs.readdirSync(__dirname).filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    }).forEach(function (file) {
        mongoose.model(path.parse(file).name, require(path.join(__dirname, file))(mongoose));
    });

} catch (error) {
    console.error(error);
    console.log("not connected");
}

module.exports = mongoose;