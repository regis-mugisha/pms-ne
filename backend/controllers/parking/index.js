const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { z } = require("zod");

const parkingSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  availableSpaces: z.number().min(0, "Spaces must be non-negative"),
  location: z.string().min(1, "Location is required"),
  feePerHour: z.number().min(0, "Fee must be non-negative"),
});

const updateParkingSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  availableSpaces: z.number().min(0, "Spaces must be non-negative").optional(),
  location: z.string().min(1, "Location is required").optional(),
  feePerHour: z.number().min(0, "Fee must be non-negative").optional(),
});

exports.registerParking = async (req, res) => {
  try {
    const data = parkingSchema.parse(req.body);

    const parking = await prisma.parking.create({
      data: {
        ...data,
      },
    });

    // Create log record
    await prisma.log.create({
      data: {
        action: "PARKING_REGISTER",
        userId: req.user.id,
        parkingId: parking.id,
      },
    });

    res.status(201).json({ message: "Parking registered", parking });
  } catch (err) {
    console.log(err);

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

exports.getAllParking = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const parkings = await prisma.parking.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const total = await prisma.parking.count();
    res.json({ parkings, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch parking" });
  }
};

exports.getParkingByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const parking = await prisma.parking.findUnique({
      where: { code },
    });
    if (!parking) {
      return res.status(404).json({ error: "Parking not found" });
    }
    res.json(parking);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch parking" });
  }
};

exports.updateParking = async (req, res) => {
  try {
    const { code } = req.params;
    const data = updateParkingSchema.parse(req.body);
    const parking = await prisma.parking.update({
      where: { code },
      data: {
        ...data,
      },
    });

    // Create log record after parking is updated
    await prisma.log.create({
      data: {
        action: "PARKING_UPDATE",
        userId: req.user.id,
        parkingId: parking.id,
      },
    });

    res.json({ message: "Parking updated", parking });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: err.errors });
    if (err.code === "P2025")
      return res.status(404).json({ error: "Parking not found" });
    res.status(500).json({ error: "Failed to update parking" });
  }
};

exports.deleteParking = async (req, res) => {
  try {
    const { code } = req.params;
    await prisma.parking.delete({
      where: { code },
    });
    res.json({ message: "Parking deleted" });
  } catch (err) {
    if (err.code === "P2025")
      return res.status(404).json({ error: "Parking not found" });
    res.status(500).json({ error: "Failed to delete parking" });
  }
};
