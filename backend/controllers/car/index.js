const { PrismaClient } = require("../../generated/prisma");
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
