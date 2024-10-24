const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwtGenerator = require('../utils/jwtGenerator');
const pool = require('../database');
const authorization = require('../middleware/authorization');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // console.log(req.body);
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
        if (user.rows.length > 0) {
            return res.status(401).json("User already exists!");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", [name, email, hashedPassword]);
        // console.log(newUser);
        const token = jwtGenerator(newUser.rows[0].user_id, newUser.rows[0].user_name);
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(401).json("Email or password is incorrect!");
        }
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
        if (!validPassword) {
            return res.status(401).json("Email or password is incorrect!");
        }
        const token = jwtGenerator(user.rows[0].user_id, user.rows[0].user_name);
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Verify
router.post('/verify', authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;