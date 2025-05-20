/**
 * @swagger
 * tags:
 *   name: Parking
 *   description: Parking management endpoints
 */

/**
 * @swagger
 * /api/parking:
 *   post:
 *     summary: Create a parking lot
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - location
 *               - totalSpaces
 *               - feePerHour
 *             properties:
 *               code:
 *                 type: string
 *                 description: Unique identifier for the parking lot
 *                 example: "PARK001"
 *               name:
 *                 type: string
 *                 description: Name of the parking lot
 *                 example: "Downtown Parking"
 *               location:
 *                 type: string
 *                 description: Physical location of the parking lot
 *                 example: "123 Main Street"
 *               totalSpaces:
 *                 type: integer
 *                 description: Total number of parking spaces available
 *                 minimum: 1
 *                 example: 50
 *               feePerHour:
 *                 type: number
 *                 description: Charging fee per hour in currency units
 *                 minimum: 0
 *                 example: 5.00
 *     responses:
 *       201:
 *         description: Parking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 code:
 *                   type: string
 *                 name:
 *                   type: string
 *                 location:
 *                   type: string
 *                 totalSpaces:
 *                   type: integer
 *                 availableSpaces:
 *                   type: integer
 *                 feePerHour:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Admin access required
 *
 *   get:
 *     summary: Get all parking lots
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of parking lots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       code:
 *                         type: string
 *                       name:
 *                         type: string
 *                       location:
 *                         type: string
 *                       totalSpaces:
 *                         type: integer
 *                       availableSpaces:
 *                         type: integer
 *                       feePerHour:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/parking/available:
 *   get:
 *     summary: Get available parking lots
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available parking lots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   code:
 *                     type: string
 *                   location:
 *                     type: string
 *                   totalSpaces:
 *                     type: integer
 *                   availableSpaces:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/parking/reports/entries:
 *   get:
 *     summary: Get car entry reports between dates
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for the report
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for the report
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of car entries in the date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       plateNumber:
 *                         type: string
 *                       parkingCode:
 *                         type: string
 *                       entryTime:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                         enum: [ACTIVE, COMPLETED]
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       400:
 *         description: Invalid date range
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/parking/reports/exits:
 *   get:
 *     summary: Get car exit reports between dates
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for the report
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for the report
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of car exits with total amount charged
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       plateNumber:
 *                         type: string
 *                       parkingCode:
 *                         type: string
 *                       entryTime:
 *                         type: string
 *                         format: date-time
 *                       exitTime:
 *                         type: string
 *                         format: date-time
 *                       duration:
 *                         type: integer
 *                         description: Duration in minutes
 *                       fee:
 *                         type: number
 *                         description: Total amount charged
 *                 totalAmount:
 *                   type: number
 *                   description: Total amount charged in the date range
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       400:
 *         description: Invalid date range
 *       401:
 *         description: Unauthorized
 */

const express = require("express");
const {
  createParking,
  getAllParking,
  getAvailableParking,
  getEntryReports,
  getExitReports,
} = require("../../controllers/parking/index");
const { protect, authorizeRoles } = require("../../middlewares/authMiddleware");

const router = express.Router();

// Admin creates parking
router.post("/", protect, authorizeRoles("ADMIN"), createParking);

// Admin and drivers can view parking
router.get("/", protect, getAllParking);
router.get("/available", protect, getAvailableParking);

// Report endpoints
router.get("/reports/entries", protect, authorizeRoles("ADMIN"), getEntryReports);
router.get("/reports/exits", protect, authorizeRoles("ADMIN"), getExitReports);

module.exports = router;
