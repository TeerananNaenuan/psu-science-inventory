const Supply = require('../Models/supplies')


exports.read = async (req, res) => {
    try {
        const id = req.params.id;
        const supply = await Supply.findById(id).exec();
        if (!supply) {
            return res.status(404).send('ไม่พบพัสดุ');
        }
        res.send(supply);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

exports.list = async (req, res) => {
    try {
        const supply = await Supply.find({}).exec();
        res.send(supply)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.addSupply = async (req, res) => {
    const { category, item, supply_number, image, stock, unit } = req.body;
    try {
        // ตรวจสอบว่ามี supply_number ซ้ำหรือไม่
        const existingSupply = await Supply.findOne({ supply_number });
        if (existingSupply) {
            return res.status(400).json({ message: 'รหัสพัสดุนี้ถูกใช้ไปแล้ว' });
        }

        // สร้าง supply ใหม่
        const newSupply = new Supply({
            category,
            item,
            supply_number,
            image,
            stock,
            unit,
        });

        // บันทึก supply ใหม่ในฐานข้อมูล
        const savedSupply = await newSupply.save();

        // ส่งข้อมูลพัสดุที่เพิ่มสำเร็จ (รวม _id) กลับไปให้ frontend
        res.status(201).json(savedSupply);
    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
};


exports.update = async (req, res) => {
    try {
        const updatedSupply = await Supply.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedSupply) return res.status(404).json({ message: 'Supply not found' });
        res.json(updatedSupply);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.deletesupply = async (req, res) => {
    try {
        const deletedSupply = await Supply.findByIdAndDelete(req.params.id);
        if (!deletedSupply) {
            return res.status(404).json({ message: 'Supply not found' });
        }
        res.json({ message: 'Supply deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};