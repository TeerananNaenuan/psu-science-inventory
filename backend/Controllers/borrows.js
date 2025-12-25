const Borrow = require('../Models/borrows');
const Supply = require('../Models/supplies');
const User = require('../Models/user');
const Backup = require('../Models/backup');

// User กดขอยืม (ยังไม่ตัด Stock, สถานะ = pending_borrow)
exports.create = async (req, res) => {
    try {
        const { user_id, supply_id, amount, due_date } = req.body;
        const user = await User.findOne({ _id: user_id }).exec();
        const supply = await Supply.findOne({ _id: supply_id }).exec();

        if (!user) return res.status(404).send('User not found');
        if (!supply) return res.status(404).send('Supply not found');

        if (supply.stock < amount) return res.status(400).send('ของในสต็อกไม่พอสำหรับการยืม');

        // สร้างรายการใหม่ (สถานะ: pending_borrow)
        const borrow = new Borrow({
            user_id: user._id,
            supply_id: supply._id,
            user_fullname: user.fullname,
            user_department: user.department,
            phone: user.phone,
            supply_item: supply.item,
            supply_number: supply.supply_number,
            amount: amount,
            borrow_date: new Date(),
            due_date: due_date,
            status: 'pending_borrow'
        });

        await borrow.save();
        res.status(201).json({ message: 'ส่งคำขอยืมเรียบร้อย รอแอดมินอนุมัติ', data: borrow });

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

// กดอนุมัติให้ยืม (ตัด Stock )
exports.approveBorrow = async (req, res) => {
    try {
        const { id } = req.params;

        const borrow = await Borrow.findById(id).exec();
        if (!borrow) return res.status(404).send('ไม่พบรายการนี้');

        const supply = await Supply.findById(borrow.supply_id);
        if (supply.stock < borrow.amount) {
            return res.status(400).send('ของหมดสต็อกแล้ว ไม่สามารถอนุมัติได้');
        }

        await Supply.findByIdAndUpdate(borrow.supply_id, { $inc: { stock: -borrow.amount } });

        const updatedBorrow = await Borrow.findByIdAndUpdate(id, {
            status: 'borrow',
            approve_date: new Date()
        }, { new: true });

        // บันทึก Log ว่ายืมสำเร็จ (Backup)
        const backupLog = new Backup({
            ref_borrow_id: updatedBorrow._id.toString(),
            action_type: 'borrow',
            user_id: updatedBorrow.user_id,
            user_fullname: updatedBorrow.user_fullname,
            user_department: updatedBorrow.user_department,
            supply_item: updatedBorrow.supply_item,
            supply_number: updatedBorrow.supply_number,
            supply_id: updatedBorrow.supply_id,
            amount: updatedBorrow.amount,
            due_date: updatedBorrow.due_date,
            action_date: new Date()
        });
        await backupLog.save();

        res.json({ message: 'อนุมัติการยืมสำเร็จ' });

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

// User กดขอคืน (เปลี่ยนสถานะ, แนบรูป)
exports.requestReturn = async (req, res) => {
    try {
        const { id } = req.params;
        const { image_retern } = req.body;

        await Borrow.findByIdAndUpdate(id, {
            status: 'pending_return',
            return_image: image_retern,
            return_request_date: new Date()
        });

        res.json({ message: 'ส่งคำขอคืนเรียบร้อย รอเจ้าหน้าที่ตรวจสอบ' });

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

// กดรับคืนพัสดุ (เพิ่ม Stock)
exports.approveReturn = async (req, res) => {
    try {
        const borrowId = req.params.id;
        const borrowData = await Borrow.findById(borrowId).exec();
        if (!borrowData) return res.status(404).send('ไม่พบรายการยืมนี้');
        await Supply.findOneAndUpdate(
            { _id: borrowData.supply_id },
            { $inc: { stock: +borrowData.amount } }
        );

        const backupLog = new Backup({
            ref_borrow_id: borrowData._id,
            action_type: 'return',
            user_id: borrowData.user_id,
            user_fullname: borrowData.user_fullname,
            user_department: borrowData.user_department,
            supply_id: borrowData.supply_id,
            supply_item: borrowData.supply_item,
            supply_number: borrowData.supply_number,
            amount: borrowData.amount,
            due_date: borrowData.due_date,
            action_date: Date.now(),
            return_image: borrowData.return_image || (req.body && req.body.return_image) || '',
            return_status: 'normal'
        });
        await backupLog.save();
        await Borrow.findByIdAndDelete(borrowId);

        res.json({ message: 'รับคืนพัสดุเรียบร้อยแล้ว', history: backupLog });

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

exports.list = async (req, res) => {
    try {
        const borrows = await Borrow.find({}).exec();
        res.send(borrows);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.byUser = async (req, res) => {
    try {
        const id = req.params.id;
        const borrows = await Borrow.find({ user_id: id }).sort({ borrow_date: -1 }).exec();
        res.send(borrows);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.rejectBorrow = async (req, res) => {
    try {
        const id = req.params.id;
        const { reject_reason } = req.body;

        const borrowData = await Borrow.findById(id).exec();
        if (!borrowData) return res.status(404).send('ไม่พบรายการ');

        // บันทึก Backup: reject_borrow
        const backupLog = new Backup({
            ref_borrow_id: borrowData._id.toString(),
            action_type: 'reject_borrow',
            user_id: borrowData.user_id,
            user_fullname: borrowData.user_fullname,
            user_department: borrowData.user_department,
            supply_item: borrowData.supply_item,
            supply_number: borrowData.supply_number,
            supply_id: borrowData.supply_id,
            amount: borrowData.amount,
            due_date: borrowData.due_date,
            action_date: new Date(),
            reject_reason: reject_reason || 'ไม่อนุมัติให้ยืม',
            return_status: 'borrow_failed'
        });

        await backupLog.save();
        await Borrow.findByIdAndDelete(id);

        res.json({ message: 'ปฏิเสธคำขอยืมเรียบร้อยแล้ว' });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

exports.rejectReturn = async (req, res) => {
    try {
        const id = req.params.id;
        const { reject_reason } = req.body;

        const borrowData = await Borrow.findById(id).exec();
        if (!borrowData) return res.status(404).send('ไม่พบรายการ');

        // คืน Stock กลับ
        // await Supply.findOneAndUpdate({ _id: borrowData.supply_id }, { $inc: { stock: +borrowData.amount } });

        const backupLog = new Backup({
            ref_borrow_id: borrowData._id.toString(),
            action_type: 'reject_return',
            user_id: borrowData.user_id,
            user_fullname: borrowData.user_fullname,
            user_department: borrowData.user_department,
            supply_item: borrowData.supply_item,
            supply_number: borrowData.supply_number,
            supply_id: borrowData.supply_id,
            amount: borrowData.amount,
            action_date: new Date(),
            image_retern: borrowData.return_image,
            reject_reason: reject_reason || 'ปฏิเสธการรับคืน',
            return_status: 'return_failed'
        });

        await backupLog.save();
        await Borrow.findByIdAndDelete(id);

        res.json({ message: 'ปฏิเสธการคืนและบันทึกประวัติเรียบร้อยแล้ว' });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};