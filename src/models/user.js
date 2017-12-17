const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    emailAddress: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false
        } 
    },
    password: {
        type: String,
        required: true
    }

});

// authenticate input againgst database doc
UserSchema.statics.authenticate = function(emailAddress, password, callback){
    User.findOne({emailAddress:emailAddress})
        .exec(function(error,user){
        if(error){
            return callback(error);
        } else if (!user) {
            var err = new Error('User not found');
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, user.password, function(error, result){
            if (result === true){
                return callback(null,user);
            } else {
                return callback();
            }
        })
    });
}

// hash password before saving to database
UserSchema.pre('save', function(next){
    var user = this;
    bcrypt.hash(user.password, 10, function(err,hash){
        if(err){
            return next(err);
        }
        user.password = hash;
        next();
    })
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
