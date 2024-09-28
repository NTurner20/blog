const jwt = require('jsonwebtoken');
const pool = require('../database');
const authorization = async (req, res, next) => {
    try {   
        const token = req.header('Authorization').replace('Bearer ', '');
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [decoded.user_id]);
        if (user.rows.length === 0) {
            return res.status(401).json("Not authorized to access this resource");
        }
        req.user = user.rows[0];
        next();
        
    } catch (error) {
        res.status(401).json("Not authorized to access this resource");
    }
};

module.exports = authorization;
