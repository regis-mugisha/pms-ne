const express = require("express");
const router = express.Router();
const carController = require("../../controllers/car/index");
const { protect, authorizeRoles } = require("../../middlewares/authMiddleware");

/**
 * @swagger
 * /car/entry:
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
 * /car/exit:
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

module.exports = router;
