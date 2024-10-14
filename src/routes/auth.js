const router = require("express").Router();
const autController = require("./../controller/auth");
const { verifyAdmin, verifyUser } = require("./../middlewares/jwt");

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
 * /register:
 *   post:
 *     summary: Modification des informations utilisateurs
 *     tags: [Auth]
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
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Information utilisateur modifié avec succès
 *       400:
 *         description: Requête invalide
 */
router.patch('/:id', verifyUser, autController.updateUser);

/**
 * @swagger
 * /deleteUser : 
 * delete:
 *      summary: Supprimer un utilisateur
 *      tags: [Auth]
 *      responses:
 *          200:
 *              description: Utilisateur supprimé avec succès
 *          400:
 *              description: Utilisateur introuvable ou requête invalide
 */
router.delete('/:id', verifyAdmin, autController.deleteUser);


module.exports = router;
