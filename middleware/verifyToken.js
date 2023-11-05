// const jwt = require("jsonwebtoken");
// const verifyToken = (req, res, next) => {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.jwtSecret);
//       req.user = decoded;
//       next();

//     } catch (error) {
//       return res.status(401).json({ error:error.message});
//     }
// }

//   module.exports = {verifyToken}

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

const verifyToken1 = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }
  try {
    const decoded = jwt.verify(token, process.env.adminjwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
module.exports = { verifyToken, verifyToken1 };
