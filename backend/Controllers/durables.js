const Durable = require('../Models/durables')

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "กรุณาระบุสถานะใหม่" });
    }

    const durable = await Durable.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).exec();

    if (!durable) {
      return res.status(404).json({ message: "ไม่พบครุภัณฑ์นี้" });
    }

    res.json(durable);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.read = async (req, res) => {
  try {
    const id = req.params.id;
    const durable = await Durable.findById(id).exec();
    if (!durable) {
      return res.status(404).send('ไม่พบครุภัณฑ์นี้');
    }
    res.send(durable);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

exports.list = async (req, res) => {
  try {
    const durable = await Durable.find({}).exec();
    res.send(durable)
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
}

exports.addDurable = async (req, res) => {
  const { asset_number, item, department, budget_year, image, status, quantity } = req.body;
  try {
    // ตรวจสอบว่ามี asset_number ซ้ำหรือไม่
    const existingDurable = await Durable.findOne({ asset_number });
    if (existingDurable) {
      return res.status(400).json({ message: 'หมายเลขครุภัณฑ์นี้ถูกใช้ไปแล้ว' });
    }

    // สร้าง durable ใหม่
    const newDurable = new Durable({
      asset_number,
      item,
      department,
      budget_year,
      image,
      status,
      quantity,
    });

    // บันทึก durable ใหม่ในฐานข้อมูล
    const savedDurable = await newDurable.save();

    // ส่งข้อมูล durable ที่เพิ่มสำเร็จ (รวม _id) กลับไปให้ frontend
    res.status(201).json(savedDurable);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.updateDurable = async (req, res) => {
  try {
    const updatedDurable = await Durable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedDurable) return res.status(404).json({ message: 'Durable not found' });
    res.json(updatedDurable);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteDurable = async (req, res) => {
  try {
    const deletedDurable = await Durable.findByIdAndDelete(req.params.id);
    if (!deletedDurable) {
      return res.status(404).json({ message: 'Durable not found' });
    }
    res.json({ message: 'Durable deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};