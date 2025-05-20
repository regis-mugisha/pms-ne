const express = require("express");
const router = express.Router();
const reportController = require("../../controllers/report/index");
const { protect, authorizeRoles } = require("../../middlewares/authMiddleware");

/**
 * @swagger
 * /reports:
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
router.get(
  "/",
  protect,
  authorizeRoles("ADMIN", "ATTENDANT"),
  reportController.getReports
);

module.exports = router;
