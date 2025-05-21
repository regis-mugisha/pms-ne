const express = require("express");
const router = express.Router();
const carController = require("../../controllers/car/index");
const { protect, authorizeRoles } = require("../../middlewares/authMiddleware");

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
 *             properties:
 *               plateNumber:
 *                 type: string
 *               parkingCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Car entry registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 ticket:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     ticketCode:
 *                       type: string
 *                     plateNumber:
 *                       type: string
 *       400:
 *         description: Invalid input or parking not available
 *       500:
 *         description: Server error
 */
router.post(
  "/entry",
  protect,
  authorizeRoles("ATTENDANT"),
  carController.registerEntry
);

/**
 * @swagger
 * /api/car/exit:
 *   post:
 *     summary: Register car exit and generate bill
 *     tags: [Car]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plateNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Car exit recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 ticket:
 *                   type: object
 *                   properties:
 *                     ticketCode:
 *                       type: string
 *                     plateNumber:
 *                       type: string
 *                     parkedHours:
 *                       type: number
 *                     charged:
 *                       type: number
 *       404:
 *         description: Car not found or already exited
 *       500:
 *         description: Server error
 */
router.post(
  "/exit",
  protect,
  authorizeRoles("ATTENDANT"),
  carController.registerExit
);

/**
 * @swagger
 * /api/car/active:
 *   get:
 *     summary: Get all active cars in parking
 *     tags: [Car]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of active cars
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cars:
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
 *                       parkingCode:
 *                         type: string
 *                 totalPages:
 *                   type: integer
 */
router.get("/active", protect, carController.getActiveCars);

/**
 * @swagger
 * /api/car/{plateNumber}:
 *   get:
 *     summary: Get car history
 *     tags: [Car]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: plateNumber
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Car history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       ticketCode:
 *                         type: string
 *                       entryTime:
 *                         type: string
 *                       exitTime:
 *                         type: string
 *                       charged:
 *                         type: number
 *                       parkingCode:
 *                         type: string
 *                 totalPages:
 *                   type: integer
 */
router.get("/:plateNumber", protect, carController.getCarHistory);

/**
 * @swagger
 * /api/car/ticket/{ticketCode}:
 *   get:
 *     summary: Get ticket details
 *     tags: [Car]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 ticketCode:
 *                   type: string
 *                 plateNumber:
 *                   type: string
 *                 entryTime:
 *                   type: string
 *                 exitTime:
 *                   type: string
 *                 charged:
 *                   type: number
 *                 parkingCode:
 *                   type: string
 */
router.get("/ticket/:ticketCode", protect, carController.getTicketDetails);

/**
 * @swagger
 * /api/car/{id}:
 *   put:
 *     summary: Update car details (Admin only)
 *     tags: [Car]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plateNumber:
 *                 type: string
 *               parkingCode:
 *                 type: string
 *               entryTime:
 *                 type: string
 *                 format: date-time
 *               exitTime:
 *                 type: string
 *                 format: date-time
 *               charged:
 *                 type: number
 *     responses:
 *       200:
 *         description: Car details updated
 *       404:
 *         description: Car not found
 */
router.put("/:id", protect, authorizeRoles("ADMIN"), carController.updateCar);

/**
 * @swagger
 * /api/car/{id}:
 *   delete:
 *     summary: Delete car record (Admin only)
 *     tags: [Car]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Car record deleted
 *       404:
 *         description: Car not found
 */
router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  carController.deleteCar
);

module.exports = router;
