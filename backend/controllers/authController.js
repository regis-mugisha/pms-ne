const { PrismaClient } = require("../generated/prisma");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const prisma = new PrismaClient();
const { z } = require("zod"); // For input validation

// Input validation schema
const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "ATTENDANT"], "Invalid role"),
});

// In authController.js, update register response to exclude createdAt
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = registerSchema.parse(
      req.body
    );
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        logs: { create: { action: "USER_REGISTER" } },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      }, // Exclude createdAt
    });
    const token = await generateToken(user);
    res.status(201).json({ token, user });
  } catch (error) {
    console.log(error);

    if (error.code === "P2002")
      return res.status(400).json({ error: "Email already exists" });
    if (error instanceof z.ZodError)
      return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = z
      .object({
        email: z.string().email("Invalid email"),
        password: z.string().min(1, "Password is required"),
      })
      .parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        password: true,
      },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      await prisma.log.create({
        data: { action: "LOGIN_FAILED", userId: user?.id },
      });
      return res.status(400).json({ error: "Invalid credentials" });
    }
    await prisma.log.create({
      data: { action: "LOGIN_SUCCESS", userId: user.id },
    });
    const token = await generateToken(user);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
