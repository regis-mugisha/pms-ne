const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

// ✅ Register car entry
exports.registerEntry = async (req, res) => {
  const { plateNumber, parkingCode } = req.body;

  try {
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
      },
    });

    // update available spaces
    await prisma.parking.update({
      where: { code: parkingCode },
      data: { availableSpaces: { decrement: 1 } },
    });

    res.status(201).json({ message: "Car entry registered", car });
  } catch (err) {
    res.status(500).json({ error: "Failed to register car entry" });
  }
};

// ✅ Car exit + calculate bill
exports.registerExit = async (req, res) => {
  const { plateNumber } = req.body;

  try {
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
      },
    });

    // increase parking space
    await prisma.parking.update({
      where: { code: car.parkingCode },
      data: { availableSpaces: { increment: 1 } },
    });

    res.json({
      message: "Car exit recorded",
      ticket: {
        plateNumber: car.plateNumber,
        parkedHours: hours,
        charged: amount,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to register car exit" });
  }
};
