const router = require('express').Router();
const bcrypt = require('bcryptjs');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});