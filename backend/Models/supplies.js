const mongoose = require('mongoose')
const Counter = require('../middlewares/counterModel')

const supplySchema = mongoose.Schema({
    _id: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    item: {
        type: String,
        required: true
    },
    supply_number: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    }
})

supplySchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    // ค้นหา counter ของ 'supplyId' แล้วบวกเลข seq ขึ้นทีละ 1
    try {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'supplyId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const seqId = String(counter.seq).padStart(2, '0');
        this._id = `sp_${seqId}`;
        next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('supplies', supplySchema)