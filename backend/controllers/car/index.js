const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { z } = require("zod");

// Input validation schemas
const entrySchema = z.object({
  plateNumber: z.string().min(1, "Plate number is required"),
  parkingCode: z.string().min(1, "Parking code is required"),
});

const exitSchema = z.object({
  plateNumber: z.string().min(1, "Plate number is required"),
});

const updateCarSchema = z.object({
  plateNumber: z.string().min(1, "Plate number is required").optional(),
  parkingCode: z.string().min(1, "Parking code is required").optional(),
  entryTime: z.string().datetime().optional(),
  exitTime: z.string().datetime().optional(),
  charged: z.number().min(0).optional(),
});

exports.registerEntry = async (req, res) => {
  try {
    const { plateNumber, parkingCode } = entrySchema.parse(req.body);
    const parking = await prisma.parking.findUnique({
      where: { code: parkingCode },
    });
    if (!parking || parking.availableSpaces <= 0)
      return res.status(400).json({ error: "Parking not available" });

    const car = await prisma.car.create({
      data: {
        plateNumber,
        parkingCode,
        entryTime: new Date(),
        logs: { create: { action: "CAR_ENTRY", parkingId: parking.id } },
      },
    });

    await prisma.parking.update({
      where: { code: parkingCode },
      data: { availableSpaces: { decrement: 1 } },
    });

    res.status(201).json({
      message: "Car entry registered",
      ticket: { id: car.id, ticketCode: car.ticketCode, plateNumber },
    });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: "Failed to register car entry" });
  }
};

exports.registerExit = async (req, res) => {
  try {
    const { plateNumber } = exitSchema.parse(req.body);
    const car = await prisma.car.findFirst({
      where: { plateNumber, exitTime: null },
      include: { parking: true },
    });

    if (!car)
      return res.status(404).json({ error: "Car not found or already exited" });

    const exitTime = new Date();
    const hours = Math.ceil((exitTime - car.entryTime) / (1000 * 60 * 60));
    const amount = hours * car.parking.feePerHour;

    const updatedCar = await prisma.car.update({
      where: { id: car.id },
      data: {
        exitTime,
        charged: amount,
        logs: { create: { action: "CAR_EXIT", parkingId: car.parking.id } },
      },
    });

    await prisma.parking.update({
      where: { code: car.parkingCode },
      data: { availableSpaces: { increment: 1 } },
    });

    res.json({
      message: "Car exit recorded",
      ticket: {
        ticketCode: car.ticketCode,
        plateNumber: car.plateNumber,
        parkedHours: hours,
        charged: amount,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: "Failed to register car exit" });
  }
};

exports.getActiveCars = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const cars = await prisma.car.findMany({
      where: { exitTime: null },
      include: { parking: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const total = await prisma.car.count({
      where: { exitTime: null },
    });
    res.json({ cars, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch active cars" });
  }
};

exports.getCarHistory = async (req, res) => {
  try {
    const { plateNumber } = req.params;
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const history = await prisma.car.findMany({
      where: { plateNumber },
      include: { parking: true },
      orderBy: { entryTime: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const total = await prisma.car.count({
      where: { plateNumber },
    });
    res.json({ history, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch car history" });
  }
};

exports.getTicketDetails = async (req, res) => {
  try {
    const { ticketCode } = req.params;
    const ticket = await prisma.car.findUnique({
      where: { ticketCode },
      include: { parking: true },
    });
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch ticket details" });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const data = updateCarSchema.parse(req.body);
    const car = await prisma.car.update({
      where: { id: Number(id) },
      data: {
        ...data,
        logs: { create: { action: "CAR_UPDATE", userId: req.user.id } },
      },
    });
    res.json({ message: "Car details updated", car });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: err.errors });
    if (err.code === "P2025")
      return res.status(404).json({ error: "Car not found" });
    res.status(500).json({ error: "Failed to update car details" });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.car.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Car record deleted" });
  } catch (err) {
    if (err.code === "P2025")
      return res.status(404).json({ error: "Car not found" });
    res.status(500).json({ error: "Failed to delete car record" });
  }
};
