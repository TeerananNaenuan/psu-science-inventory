const mongoose = require('mongoose')
const Counter = require('../middlewares/counterModel')

const userSchema = mongoose.Schema({
    _id: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'samo', 'rally', 'user']
    },
    image: {
        type: String,
        default: ''
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    try {
        // ค้นหา counter ของ 'userId' แล้วบวกเลข seq ขึ้นทีละ 1
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'userId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const seqId = String(counter.seq).padStart(2, '0');
        this._id = `user_${seqId}`;
        next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('users', userSchema)