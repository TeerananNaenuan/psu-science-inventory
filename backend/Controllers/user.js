const User = require('../Models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


exports.read = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(404).send('ไม่พบผู้ใช้');
        }
        res.send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign(
            { _id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token, user: {
                _id: user._id,
                username: user.username,
                role: user.role,
                fullname: user.fullname
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.register = async (req, res) => {
    const { username, password, email, fullname, phone, department, role, image } = req.body;
    try {
        // ตรวจสอบว่ามี username ซ้ำหรือไม่
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'มีชื่อผู้ใช้นี้แล้วในระบบ' });
        }

        // ตรวจสอบว่า email ซ้ำหรือไม่
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'อีเมลนี้ถูกใช้ไปแล้ว' });
        }

        // hash password ก่อนบันทึก
        const hashedPassword = await bcrypt.hash(password, 10);

        // สร้าง user ใหม่
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            fullname,
            phone,
            department,
            role,
            image
        });

        await newUser.save();
        res.status(201).json({ message: 'ลงทะเบียนสำเร็จ' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
};

exports.list = async (req, res) => {
    try {
        const users = await User.find({}).exec();
        res.send(users)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = { ...req.body };

        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // ตรวจสอบสิทธิ์: Admin แก้ไขได้ทุกคน, User แก้ไขได้แค่ตัวเอง
        const currentUserId = req.user.id || req.user._id;

        if (req.user.role !== 'admin' && currentUserId.toString() !== id) {
            return res.status(403).json({ message: 'คุณไม่มีสิทธิ์แก้ไขข้อมูลบัญชีนี้' });
        }

        // ป้องกัน User ธรรมดาแอบเปลี่ยน Role ตัวเองเป็น Admin
        if (req.user.role !== 'admin' && updates.role) {
            delete updates.role;
        }

        // ตรวจสอบอีเมลซ้ำ
        if (updates.email) {
            const existingEmail = await User.findOne({ email: updates.email, _id: { $ne: id } });
            if (existingEmail) {
                return res.status(400).json({ message: 'อีเมลนี้ถูกใช้ไปแล้ว' });
            }
        }

        // จัดการ Password
        if (updates.password && updates.password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        } else {
            delete updates.password;
        }

        // อัปเดตข้อมูล 
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).exec();

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // สร้าง Token ใหม่
        const token = jwt.sign(
            { id: updatedUser._id, username: updatedUser.username, role: updatedUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            user: updatedUser,
            token
        });

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'ลบผู้ใช้สำเร็จ', deletedUser });
    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
};