const express = require("express");
const router = express.Router();
const parkingController = require("../../controllers/parking/index");
const { protect, authorizeRoles } = require("../../middlewares/authMiddleware");

/**
 * @swagger
 * /api/parking:
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
 * /api/parking/available:
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
  authorizeRoles("ATTENDANT", "ADMIN"),
  parkingController.getAvailableParking
);

/**
 * @swagger
 * /api/parking:
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
 *     responses:
 *       200:
 *         description: List of parking lots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 parkings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Parking'
 *                 totalPages:
 *                   type: integer
 */
router.get(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  parkingController.getAllParking
);

/**
 * @swagger
 * /api/parking/{code}:
 *   get:
 *     summary: Get parking details by code
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parking details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parking'
 */
router.get("/:code", protect, parkingController.getParkingByCode);

/**
 * @swagger
 * /api/parking/{code}:
 *   put:
 *     summary: Update parking details
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               availableSpaces:
 *                 type: integer
 *               location:
 *                 type: string
 *               feePerHour:
 *                 type: number
 *     responses:
 *       200:
 *         description: Parking updated
 */
router.put(
  "/:code",
  protect,
  authorizeRoles("ADMIN"),
  parkingController.updateParking
);

/**
 * @swagger
 * /api/parking/{code}:
 *   delete:
 *     summary: Delete parking
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parking deleted
 */
router.delete(
  "/:code",
  protect,
  authorizeRoles("ADMIN"),
  parkingController.deleteParking
);

module.exports = router;
