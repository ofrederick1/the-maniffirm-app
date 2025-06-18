// middleware/validate-session.js

const jwt = require('jsonwebtoken');
const User = require('../../models/user.model'); // Import your User model

module.exports = async (req, res, next) => {
  // Log headers for troubleshooting
  console.log('REQUEST HEADERS:', req.headers);

  // Expect the token to be sent directly in the Authorization header
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).send({ auth: false, message: 'No Token Provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err || !decoded) {
      return res.status(401).send({ error: 'Not Authorized' });
    }

    try {
      const user = await User.findOne({ where: { id: decoded.id } });
      if (!user) {
        return res.status(401).send({ error: 'Not Authorized' });
      }

      req.user = user;
      req.userType = user.userType; 
      req.username = user.username;
      next();
    } catch (error) {
      console.error('Token processing error:', error);
      return res.status(500).send({ error: 'Failed to process token' });
    }
  });
};
