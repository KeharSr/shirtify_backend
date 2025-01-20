const mongoose = require('mongoose')


const database = () => {
    mongoose.connect(process.env.MONGODB_LOCAL).then(() => {
        console.log('Database Connect Successfully');
    });
}


module.exports = database;