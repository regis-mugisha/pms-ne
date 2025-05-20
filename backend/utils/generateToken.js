const jwt = require("jsonwebtoken");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function generateToken(user) {
  console.log("Generating token for user:", user.id);
  try {
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role.toString() }, // Convert enum to string
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    await prisma.log.create({
      data: { action: "TOKEN_GENERATED", userId: user.id },
    });
    return token;
  } catch (error) {
    console.error("Generate token error:", error);
    throw error;
  }
}

module.exports = generateToken;
