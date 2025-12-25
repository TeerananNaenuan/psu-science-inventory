const mongoose = require('mongoose');
const Counter = require('../middlewares/counterModel')


const borrowSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    user_id: {
        type: String,
        ref: 'users',
        required: true
    },
    supply_id: {
        type: String,
        ref: 'supplies',
        required: true
    },
    // เก็บข้อมูลเวลาที่ยืม
    user_fullname: { type: String, required: true },
    user_department: { type: String },
    phone: { type: String },
    supply_item: { type: String, required: true },
    supply_number: { type: String },
    // ข้อมูลการยืม
    amount: { type: Number, required: true, min: 1 },
    borrow_date: { type: Date, default: Date.now },
    due_date: { type: Date },
    return_image: { type: String },
    status: {
        type: String,
        enum: ['pending_borrow', 'borrow', 'return', 'pending_return'],
    }
});

borrowSchema.pre('save', async function (next) {

    if (!this.isNew) return next();
    try {
        // ค้นหา counter ของ 'borrowId' แล้วบวกเลข seq ขึ้นทีละ 1
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'borrowId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const seqId = String(counter.seq).padStart(2, '0');

        this._id = `brt_${seqId}`;
        next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('borrows', borrowSchema);