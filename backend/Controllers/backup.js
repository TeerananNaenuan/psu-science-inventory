const Backup = require('../Models/backup');

// ดูประวัติทั้งหมด
exports.listHistory = async (req, res) => {
    try {
        const history = await Backup.find({}).sort({ action_date: -1 }).exec();
        res.send(history);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

// ดูประวัติเฉพาะบุคคล
exports.myHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const history = await Backup.find({ user_id: userId }).sort({ action_date: -1 }).exec();
        res.send(history);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};