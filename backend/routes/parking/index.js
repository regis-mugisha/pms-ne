const express = require("express");
const router = express.Router();
const parkingController = require("../../controllers/parking/index");
const { protect, authorizeRoles } = require("../../middlewares/authMiddleware");

/**
 * @swagger
 * /parking:
 *   post:
 *     summary: Register new parking
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               availableSpaces:
 *                 type: integer
 *               location:
 *                 type: string
 *               feePerHour:
 *                 type: number
 *     responses:
 *       201:
 *         description: Parking registered
 *       400:
 *         description: Invalid input or code exists
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  parkingController.registerParking
);

/**
 * @swagger
 * /parking/available:
 *   get:
 *     summary: Get available parking lots
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Available parking lots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 parkings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                       name:
 *                         type: string
 *                       availableSpaces:
 *                         type: integer
 *                       location:
 *                         type: string
 *                       feePerHour:
 *                         type: number
 *                 totalPages:
 *                   type: integer
 */
router.get(
  "/available",
  protect,
  authorizeRoles("ATTENDANT"),
  parkingController.getAvailableParking
);

module.exports = router;
