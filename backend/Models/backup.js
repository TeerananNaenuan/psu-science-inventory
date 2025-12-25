const mongoose = require('mongoose');
const Counter = require('../middlewares/counterModel')

const backupSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    ref_borrow_id: { type: String },
    action_type: {
        type: String,
        enum: ['borrow', 'return', 'reject_borrow', 'reject_return'],
        required: true
    },
    // ข้อมูล User
    user_id: { type: String, required: true },
    user_fullname: { type: String },
    user_department: { type: String },
    // ข้อมูล Supply
    supply_id: { type: String, required: true },
    supply_item: { type: String },
    supply_number: { type: String },
    // รายละเอียด
    amount: { type: Number, required: true },
    action_date: { type: Date, default: Date.now },
    image: { type: String },
    return_image: { type: String },
    due_date: { type: Date },
    return_status: { type: String },
    reject_reason: { type: String }
});



backupSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    try {
        // ค้นหา counter ของ 'backupId' แล้วบวกเลข seq ขึ้นทีละ 1
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'backupId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const seqId = String(counter.seq).padStart(2, '0');

        this._id = `bkp_${seqId}`;
        next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('backups', backupSchema);