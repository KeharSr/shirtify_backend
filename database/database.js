const mongoose = require('mongoose')


const database = () => {
    mongoose.connect(process.env.MONGODB_LOCAL).then(() => {
        console.log('Database Connect Vayo Vai');
    });
}


module.exports = database;