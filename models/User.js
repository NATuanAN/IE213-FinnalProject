const mongodb = require('mongoose');
const userSchema = new mongodb.Schema({
    email: String,
    username: String,
    password: String,
    role: {
        type: String,
        default: 'USERS',
        enum: ['USER', 'ADMINS'],
    },
    userImage: String,
});


const User = mongodb.model('User', userSchema);


module.exports = User;
