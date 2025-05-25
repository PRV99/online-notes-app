const jwt = require('jsonwebtoken');

const fetchUser = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1]; // get token after 'Bearer'

  if (!token) {
    return res.status(401).send({ error: "Access Denied: No Token Provided" });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user; // { id: ... }
    next();
  } catch (error) {
    res.status(401).send({ error: "Access Denied: Invalid Token" });
  }
};

module.exports = fetchUser;