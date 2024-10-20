const router = require("express").Router();
const ReviewController = require("./../controller/ReviewController");

/**
 * @swagger
 * tags:
 *   name: Review
 *   description: Review related API endpoints
 */

/**
 * @swagger
 * /review/{cvId}:
 *   post:
 *     summary: Ajout d'une nouvelle review
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *               user:
 *                 type: User
 *               cv:
 *                 type: Cv
 *     responses:
 *       201:
 *         description: Review ajoutée avec succès
 *       400:
 *         description: Requête invalide
 */
router.post("/:id", ReviewController.create);

module.exports = router;
