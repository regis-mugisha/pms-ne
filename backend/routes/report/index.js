const express = require("express");
const router = express.Router();
const reportController = require("../../controllers/report/index");
const { protect, authorizeRoles } = require("../../middlewares/authMiddleware");

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get car entry/exit reports
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reports fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entries:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       ticketCode:
 *                         type: string
 *                       plateNumber:
 *                         type: string
 *                       entryTime:
 *                         type: string
 *                 exits:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       ticketCode:
 *                         type: string
 *                       plateNumber:
 *                         type: string
 *                       exitTime:
 *                         type: string
 *                       charged:
 *                         type: number
 *                 totalPages:
 *                   type: integer
 */
router.get("/", protect, authorizeRoles("ADMIN"), reportController.getReports);

/**
 * @swagger
 * /api/reports/revenue:
 *   get:
 *     summary: Get revenue reports between dates
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Revenue report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 revenue:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       parkingCode:
 *                         type: string
 *                       totalRevenue:
 *                         type: number
 *                       totalCars:
 *                         type: integer
 *                 totalRevenue:
 *                   type: number
 *                 totalPages:
 *                   type: integer
 */
router.get(
  "/revenue",
  protect,
  authorizeRoles("ADMIN"),
  reportController.getRevenueReport
);

/**
 * @swagger
 * /api/reports/occupancy:
 *   get:
 *     summary: Get occupancy reports between dates
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Occupancy report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 occupancy:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       parkingCode:
 *                         type: string
 *                       totalSpaces:
 *                         type: integer
 *                       occupiedSpaces:
 *                         type: integer
 *                       occupancyRate:
 *                         type: number
 *                 totalPages:
 *                   type: integer
 */
router.get(
  "/occupancy",
  protect,
  authorizeRoles("ADMIN"),
  reportController.getOccupancyReport
);

module.exports = router;
