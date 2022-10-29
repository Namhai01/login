const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        required: true
    }   
})
module.exports = mongoose.model('login',Schema);