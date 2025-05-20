const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

exports.createParking = async (req, res) => {
  const { code, name, availableSpaces, location, feePerHour } = req.body;
  try {
    const parking = await prisma.parking.create({
      data: { code, name, availableSpaces, location, feePerHour },
    });
    res.status(201).json(parking);
  } catch (err) {
    res.status(400).json({ error: "Parking already exists or invalid data" });
  }
};

exports.getAllParking = async (req, res) => {
  const parkings = await prisma.parking.findMany();
  res.json(parkings);
};

exports.getAvailableParking = async (req, res) => {
  const available = await prisma.parking.findMany({
    where: { availableSpaces: { gt: 0 } },
    select: {
      code: true,
      name: true,
      location: true,
      availableSpaces: true,
      feePerHour: true,
    },
  });
  res.json(available);
};
