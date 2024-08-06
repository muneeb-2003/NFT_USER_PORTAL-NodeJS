const { default: mongoose } = require('mongoose');
const monsgoose = require('mongoose');
monsgoose.connect("mongodb://127.0.0.1:27017/testapp1");

const userSchema = mongoose.Schema({
    image: String,
    email: String,
    name: String
})
module.exports = monsgoose.model('user', userSchema);