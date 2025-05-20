/**
 * @swagger
 * tags:
 *   name: Car
 *   description: Car entry and exit endpoints
 */

/**
 * @swagger
 * /api/car/entry:
 *   post:
 *     summary: Register car entry
 *     tags: [Car]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plateNumber
 *               - parkingCode
 *             properties:
 *               plateNumber:
 *                 type: string
 *                 description: Vehicle's license plate number
 *                 example: "ABC123"
 *               parkingCode:
 *                 type: string
 *                 description: Code of the parking lot where the car is entering
 *                 example: "PARK001"
 *     responses:
 *       201:
 *         description: Car entry registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 plateNumber:
 *                   type: string
 *                 parkingCode:
 *                   type: string
 *                 entryTime:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                   enum: [ACTIVE]
 *       400:
 *         description: Invalid input or parking lot is full
 *       401:
 *         description: Unauthorized - Driver access required
 *       404:
 *         description: Parking lot not found
 */

/**
 * @swagger
 * /api/car/exit:
 *   post:
 *     summary: Register car exit
 *     tags: [Car]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plateNumber
 *             properties:
 *               plateNumber:
 *                 type: string
 *                 description: Vehicle's license plate number
 *                 example: "ABC123"
 *     responses:
 *       200:
 *         description: Car exit registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 plateNumber:
 *                   type: string
 *                 parkingCode:
 *                   type: string
 *                 entryTime:
 *                   type: string
 *                   format: date-time
 *                 exitTime:
 *                   type: string
 *                   format: date-time
 *                 duration:
 *                   type: integer
 *                   description: Duration in minutes
 *                 fee:
 *                   type: number
 *                   description: Parking fee in currency units
 *                 status:
 *                   type: string
 *                   enum: [COMPLETED]
 *       400:
 *         description: Invalid input or car not found in parking
 *       401:
 *         description: Unauthorized - Driver access required
 *       404:
 *         description: Active parking record not found
 */

const express = require("express");
const { registerEntry, registerExit } = require("../../controllers/car/index");
const { protect, authorizeRoles } = require("../../middlewares/authMiddleware");

const router = express.Router();

// Driver enters and exits parking
router.post("/entry", protect, authorizeRoles("DRIVER"), registerEntry);
router.post("/exit", protect, authorizeRoles("DRIVER"), registerExit);

module.exports = router;
