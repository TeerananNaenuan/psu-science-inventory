const express = require('express');
const router = express.Router();
const {
    create,
    approveBorrow,
    requestReturn,
    approveReturn,
    list,
    byUser,
    rejectBorrow,
    rejectReturn

} = require('../Controllers/borrows')

// POST /borrows
router.post('/borrows', create)
// PUT /borrows/approve/:id
router.put('/borrows/approve/:id', approveBorrow)
// PUT /borrows/request-return/:id
router.put('/borrows/request-return/:id', requestReturn)
// PUT /borrows/approve-return/:id
router.put('/borrows/return/:id', approveReturn)
// GET /borrows
router.get('/borrows', list)
// GET /borrows/:id
router.get('/borrows/user/:id', byUser)
// PUT /borrows/reject/:id
router.put('/borrows/reject-borrow/:id', rejectBorrow)
// PUT /borrows/reject-return/:id
router.put('/borrows/reject-return/:id', rejectReturn)

module.exports = router