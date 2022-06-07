const jwt = require('jsonwebtoken');

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. Access denied' });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized. Access denied' });
    }
}

module.exports = fetchUser;