const router = require('express').Router();
const pool = require('../database');
const authorization = require('../middleware/authorization');

// Get posts
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM posts');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
//  Create post
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

// Delete post
router.delete('/posts/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const deletePost = await pool.query('DELETE FROM posts WHERE post_id = $1 and user_id = $2', [id, req.user.user_id]);
        res.json('Post was deleted');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Edit post
router.put('/posts/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const updatePost = await pool.query('UPDATE posts SET post_title = $1, post_content = $2 WHERE post_id = $3 and user_id = $4', [title, content, id, req.user.user_id]);
        res.json('Post was updated');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
module.exports = router;