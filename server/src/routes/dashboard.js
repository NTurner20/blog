const router = require('express').Router();
const pool = require('../database');
const authorization = require('../middleware/authorization');

router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM posts');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/posts', authorization, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = await pool.query('INSERT INTO posts (post_title, post_content, user_id) VALUES ($1, $2, $3) RETURNING *', [title, content, req.user.user_id]);
        res.json(newPost.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;