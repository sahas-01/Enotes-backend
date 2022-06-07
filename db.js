const mongoose = require('mongoose');

const connectToMongo = () => {

    console.log(process.env.MONGODB_URI);
    mongoose.connect(process.env.MONGODB_URI, () => {
        console.log('connected to mongo');
    });
}

module.exports = connectToMongo;