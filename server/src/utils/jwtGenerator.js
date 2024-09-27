const jwt = require('jsonwebtoken');

const jwtGenerator = (user_id, user_name) => {
    const payload = { user_id, user_name };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = jwtGenerator;