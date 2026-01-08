require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const userRoutes = require('./Routes/user');
const supplyRoutes = require('./Routes/supplies');
const durableRoutes = require('./Routes/durables');
const borrowRoutes = require('./Routes/borrows');
const backupRoutes = require('./Routes/backup');
const imagekit = require('./Routes/imagekit');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(userRoutes)
app.use(supplyRoutes)
app.use(durableRoutes)
app.use(borrowRoutes)
app.use(backupRoutes)

app.get('/imagekit-auth', function (req, res) {
    try {
        var result = imagekit.getAuthenticationParameters();
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


