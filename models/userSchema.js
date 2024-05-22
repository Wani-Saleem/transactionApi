const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    userName: {
        type : String,
        required: true,
        unique: true
    },
    passWord: {
        type : String,
        required: true
    },
    accountNo: {
        type : Number,
        maxLength : 10,
        required: true,
        unique: true
    },
    ifscCode: {
        type : Number,
        maxLength : 8,
        required: true
    },
    activationStatus: {
        type : String,
        enum : ['active', 'inactive'],
        required: true
    },
    accountMoney: {
        type : Number
    }
});

userSchema.methods.comparePassword = async function (userPassword) {
    try{
        const isMatch = await bcrypt.compare(userPassword, this.passWord);
        return isMatch;
    }catch(err){
        throw err;
    }
}

userSchema.pre('save', async function (next) {
    const user = this;
    if(!user.isModified('passWord')) return next();

    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.passWord, salt);
        user.passWord = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
})

const UserProfile = mongoose.model('UserProfile', userSchema);

module.exports = UserProfile;