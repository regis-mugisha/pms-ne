const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { z } = require("zod");

const reportSchema = z.object({
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
});

exports.getReports = async (req, res) => {
  try {
    const { start, end, page } = reportSchema.parse(req.query);
    const pageSize = 10;

    const entries = await prisma.car.findMany({
      where: {
        entryTime: {
          gte: start ? new Date(start) : undefined,
          lte: end ? new Date(end) : undefined,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        ticketCode: true,
        plateNumber: true,
        entryTime: true,
      },
    });

    const exits = await prisma.car.findMany({
      where: {
        exitTime: {
          gte: start ? new Date(start) : undefined,
          lte: end ? new Date(end) : undefined,
          not: null,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        ticketCode: true,
        plateNumber: true,
        exitTime: true,
        charged: true,
      },
    });

    const totalEntries = await prisma.car.count({
      where: {
        entryTime: {
          gte: start ? new Date(start) : undefined,
          lte: end ? new Date(end) : undefined,
        },
      },
    });

    res.json({
      entries,
      exits,
      totalPages: Math.ceil(totalEntries / pageSize),
    });
  } catch (err) {
    console.log(err);

    if (err instanceof z.ZodError)
      return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

exports.getRevenueReport = async (req, res) => {
  try {
    const { start, end, page } = reportSchema.parse(req.query);
    const pageSize = 10;

    const revenue = await prisma.car.groupBy({
      by: ["parkingCode"],
      where: {
        exitTime: {
          gte: start ? new Date(start) : undefined,
          lte: end ? new Date(end) : undefined,
          not: null,
        },
      },
      _sum: {
        charged: true,
      },
      _count: {
        id: true,
      },
    });

    const totalRevenue = revenue.reduce(
      (sum, item) => sum + (item._sum.charged || 0),
      0
    );

    res.json({
      revenue: revenue.map((item) => ({
        parkingCode: item.parkingCode,
        totalRevenue: item._sum.charged || 0,
        totalCars: item._count.id,
      })),
      totalRevenue,
      totalPages: Math.ceil(revenue.length / pageSize),
    });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: "Failed to fetch revenue report" });
  }
};

exports.getOccupancyReport = async (req, res) => {
  try {
    const { start, end, page } = reportSchema.parse(req.query);
    const pageSize = 10;

    const parkings = await prisma.parking.findMany({
      include: {
        _count: {
          select: {
            cars: {
              where: {
                exitTime: null,
              },
            },
          },
        },
      },
    });

    const occupancy = parkings.map((parking) => ({
      parkingCode: parking.code,
      totalSpaces: parking.availableSpaces + parking._count.cars,
      occupiedSpaces: parking._count.cars,
      occupancyRate:
        (parking._count.cars /
          (parking.availableSpaces + parking._count.cars)) *
        100,
    }));

    res.json({
      occupancy,
      totalPages: Math.ceil(occupancy.length / pageSize),
    });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: "Failed to fetch occupancy report" });
  }
};
