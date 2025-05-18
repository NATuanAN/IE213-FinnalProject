const mongodb = require('mongoose');
const userSchema = new mongodb.Schema({
    email: String,
    username: String,
    password: String,
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
    },
    userImage: String,
});

// Tạo model từ schema
const User = mongodb.model('User', userSchema);


// Export model để dùng ở file khác
module.exports = User;
