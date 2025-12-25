const express = require('express');
const router = express.Router();
const{
    listHistory,
    myHistory
} = require('../Controllers/backup')

// GET /backup/history
router.get('/history', listHistory);
// GET /backup/history/:userId
router.get('/history/user/:userId', myHistory);

module.exports = router