/**
 * @swagger
 * tags:
 *   name: Test
 *   description: Test endpoints for role-based access
 */

/**
 * @swagger
 * /api/test/admin:
 *   get:
 *     summary: Admin test endpoint
 *     tags: [Test]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hello Admin!
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/test/driver:
 *   get:
 *     summary: Driver test endpoint
 *     tags: [Test]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hello Driver!
 *       401:
 *         description: Unauthorized
 */

const express = require("express");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/admin", protect, authorizeRoles("ADMIN"), (req, res) => {
  res.send("Hello Admin!");
});

router.get("/driver", protect, authorizeRoles("DRIVER"), (req, res) => {
  res.send("Hello Driver!");
});

module.exports = router;
