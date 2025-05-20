const { PrismaClient } = require("../generated/prisma");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      },
    });
    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(400).json({ error: "User already exists or invalid data" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = generateToken(user);
  res.json({ token, user });
};
