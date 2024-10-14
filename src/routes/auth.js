const router = require("express").Router();
const autController = require("./../controller/auth");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Books API Endpoints
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Enregistrement d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
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
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Requête invalide
 */
router.post("/register", autController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentification de l'utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Succès de l'authentification
 *       401:
 *         description: Échec de l'authentification
 */
router.post("/login", autController.login);

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
router.delete("/:id", autController.deleteUser);

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
router.patch("/:id", autController.editInfo);

module.exports = router;
