const mongoose = require('mongoose')
const Counter = require('../middlewares/counterModel')

const durableSchema = mongoose.Schema({
    _id: {
        type: String
    },
    asset_number: {
        type: String,
        required: true,
        unique: true
    },
    item: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    budget_year: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    status: {
        type: String,
        required: true,
        enum: ['พร้อมใช้งาน', 'เสื่อมสภาพ', 'ชำรุด', 'สูญหาย']
    },
    quantity: {
        type: Number,
        required: true
    },

})

durableSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    // ค้นหา counter ของ 'durableId' แล้วบวกเลข seq ขึ้นทีละ 1
    try {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'durableId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const seqId = String(counter.seq).padStart(2, '0');
        this._id = `drb_${seqId}`;
        next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('durables', durableSchema)