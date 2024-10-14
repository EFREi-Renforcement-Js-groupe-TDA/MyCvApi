const router = require("express").Router();
const UserController = require("./../controller/UserController");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User related API endpoints
 */

/**
 * @swagger
 * /{id}:
 *   patch:
 *     summary: Modifier ses informations
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à modifier
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Informations modifés avec succès
 *       400:
 *         description: Requête invalide
 */
router.patch("/:id", UserController.edit);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       401:
 *         description: Échec de la suppression (authentification requise)
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete("/:id", UserController.delete);

module.exports = router;
