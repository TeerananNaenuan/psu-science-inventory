const express = require('express')
const router = express.Router()
const {
    read,
    list,
    addSupply,
    update,
    deletesupply
} = require('../Controllers/supplies')


// GET /supplies
router.get('/supplies', list)
// POST /supplies
router.post('/supplies', addSupply)
// PUT /supplies/:id
router.put('/supplies/:id', update)
// DELETE /supplies/:id
router.delete('/supplies/:id', deletesupply)
// GET /supplies/:id
router.get('/supplies/:id', read)


module.exports = router