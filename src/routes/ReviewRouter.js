const router = require("express").Router();
const ReviewController = require("./../controller/ReviewController");

/**
 * @swagger
 * tags:
 *   name: Review
 *   description: Review related API endpoints
 */

router.post("/:id", ReviewController.create);

module.exports = router;
