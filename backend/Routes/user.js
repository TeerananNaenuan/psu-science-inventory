const express = require('express')
const router = express.Router()
const {
    read,
    register,
    login,
    list,
    update,
    deleteUser
} = require('../Controllers/user')

const { authMiddleware, adminMiddleware } = require('../middlewares/auth');


// POST /login
router.post('/login', login)
// POST /register
router.post('/register', register)
// GET /users
router.get('/users',authMiddleware ,adminMiddleware, list)
// PUT /users/:id
router.put('/users/:id',authMiddleware , update)
// DELETE /users/:id
router.delete('/users/:id',authMiddleware , deleteUser)
// GET /users/:id
router.get('/users/:id',authMiddleware , read)



module.exports = router