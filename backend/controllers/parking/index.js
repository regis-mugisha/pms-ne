const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();
const { z } = require("zod");

const parkingSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  availableSpaces: z.number().min(0, "Spaces must be non-negative"),
  location: z.string().min(1, "Location is required"),
  feePerHour: z.number().min(0, "Fee must be non-negative"),
});

exports.registerParking = async (req, res) => {
  try {
    const data = parkingSchema.parse(req.body);
    const parking = await prisma.parking.create({
      data: {
        ...data,
        logs: { create: { action: "PARKING_REGISTER", userId: req.user.id } },
      },
    });
    res.status(201).json({ message: "Parking registered", parking });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: err.errors });
    if (err.code === "P2002")
      return res.status(400).json({ error: "Parking code already exists" });
    res.status(500).json({ error: "Failed to register parking" });
  }
};

exports.getAvailableParking = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const parkings = await prisma.parking.findMany({
      where: { availableSpaces: { gt: 0 } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const total = await prisma.parking.count({
      where: { availableSpaces: { gt: 0 } },
    });
    res.json({ parkings, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch parking" });
  }
};
