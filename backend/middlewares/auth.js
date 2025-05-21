const jwt = require("jsonwebtoken");
const { Role } = require("@prisma/client");

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.userRole !== Role.ADMIN) {
    return res.status(403).send({ message: "Requires Admin Role!" });
  }
  next();
};

const isAttendant = (req, res, next) => {
  if (req.userRole !== Role.ATTENDANT) {
    return res.status(403).send({ message: "Requires Attendant Role!" });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isAttendant,
};
