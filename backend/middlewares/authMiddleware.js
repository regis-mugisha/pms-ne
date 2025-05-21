const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    prisma.log.create({ data: { action: "AUTH_FAILED", userId: null } });
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    prisma.log.create({ data: { action: "AUTH_FAILED", userId: null } });
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(401).json({ error: "Invalid token" });
  }
}

function authorizeRoles(...roles) {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      await prisma.log.create({
        data: { action: "ACCESS_DENIED", userId: req.user.id },
      });
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
}

module.exports = { protect, authorizeRoles };
