const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function seed() {
  try {
    // Clear existing data
    await prisma.log.deleteMany();
    await prisma.car.deleteMany();
    await prisma.parking.deleteMany();
    await prisma.user.deleteMany();

    // Seed Users (15 users: 5 ADMIN, 10 ATTENDANT)
    const users = [];
    for (let i = 1; i <= 5; i++) {
      users.push({
        firstName: `Admin${i}`,
        lastName: "User",
        email: `admin${i}@example.com`,
        password: await bcrypt.hash(`admin${i}123`, 10),
        role: "ADMIN",
      });
    }
    for (let i = 1; i <= 10; i++) {
      users.push({
        firstName: `Attendant${i}`,
        lastName: "User",
        email: `attendant${i}@example.com`,
        password: await bcrypt.hash(`attend${i}123`, 10),
        role: "ATTENDANT",
      });
    }
    await prisma.user.createMany({ data: users });

    // Fetch created users to get their IDs
    const createdUsers = await prisma.user.findMany({ select: { id: true } });
    const userIds = createdUsers.map((user) => user.id);

    // Seed Parking Lots (5 parking lots)
    const parkings = [
      {
        code: "PARK1",
        name: "Downtown Lot",
        availableSpaces: 50,
        location: "Downtown",
        feePerHour: 2.5,
      },
      {
        code: "PARK2",
        name: "Uptown Lot",
        availableSpaces: 30,
        location: "Uptown",
        feePerHour: 3.0,
      },
      {
        code: "PARK3",
        name: "Central Lot",
        availableSpaces: 40,
        location: "Central",
        feePerHour: 2.0,
      },
      {
        code: "PARK4",
        name: "Westside Lot",
        availableSpaces: 60,
        location: "Westside",
        feePerHour: 1.5,
      },
      {
        code: "PARK5",
        name: "Eastside Lot",
        availableSpaces: 20,
        location: "Eastside",
        feePerHour: 4.0,
      },
    ];
    await prisma.parking.createMany({ data: parkings });

    // Seed Cars (20 cars: 12 entries, 8 exits)
    const cars = [];
    const parkingCodes = ["PARK1", "PARK2", "PARK3", "PARK4", "PARK5"];
    for (let i = 1; i <= 20; i++) {
      const isExit = i <= 8; // First 8 cars have exited
      cars.push({
        ticketCode: `TICKET${i}`,
        plateNumber: `PLATE${i}`,
        parkingCode: parkingCodes[i % 5], // Rotate through parking lots
        entryTime: new Date(
          `2025-05-${19 + (i % 3)}T${String(10 + (i % 5)).padStart(
            2,
            "0"
          )}:00:00Z`
        ),
        exitTime: isExit
          ? new Date(
              `2025-05-${19 + (i % 3)}T${String(12 + (i % 5)).padStart(
                2,
                "0"
              )}:00:00Z`
            )
          : null,
        charged: isExit ? (i % 5) * 2.5 : 0.0,
      });
    }
    await prisma.car.createMany({ data: cars });

    // Fetch created cars to get their IDs
    const createdCars = await prisma.car.findMany({ select: { id: true } });
    const carIds = createdCars.map((car) => car.id);

    // Seed Logs (20 logs: various actions)
    const logs = [];
    for (let i = 1; i <= 20; i++) {
      logs.push({
        action:
          i % 3 === 0
            ? "USER_REGISTER"
            : i % 3 === 1
            ? "LOGIN_SUCCESS"
            : i % 5 === 0
            ? "CAR_EXIT"
            : "CAR_ENTRY",
        userId: userIds[i % userIds.length], // Use valid user IDs
        carId: carIds[i % carIds.length], // Use valid car IDs
        createdAt: new Date(
          `2025-05-${19 + (i % 3)}T${String(8 + (i % 5)).padStart(
            2,
            "0"
          )}:00:00Z`
        ),
      });
    }
    await prisma.log.createMany({ data: logs });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
