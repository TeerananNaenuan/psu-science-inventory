const express = require('express')
const router = express.Router()
const {
    read,
    list,
    addDurable,
    updateDurable,
    deleteDurable,
    updateStatus
    
} = require('../Controllers/durables')


// GET /durables
router.get('/durables', list)
// POST /durables
router.post('/durables', addDurable)
// PUT /durables/:id
router.put('/durables/:id', updateDurable)
// DELETE /durables/:id
router.delete('/durables/:id', deleteDurable)
// GET /durables/:id
router.get('/durables/:id', read)
// PATCH /durables/:id  (อัปเดตสถานะ)
router.patch('/durables/:id', updateStatus)



module.exports = router