const { PrismaClient } = require("../../generated/prisma");
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
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};
