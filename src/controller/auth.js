const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("./../models/User");
const { verifyUser } = require("../validator/user");
const Role = require("../enum/RolesEnum");

module.exports = {
    register: async (req, res) => {
        try {
            verifyUser(req.body);
            const { firstname, lastname, email, password, role } = req.body;

            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).send({
                    message: "Un compte avec cet email existe déjà",
                });
            }

            const hash = await bcrypt.hash(password, 10);
            const newUser = new UserModel({
                firstname,
                lastname,
                email,
                password: hash,
                role: role || Role.USER,
            });

            await newUser.save();
            res.status(201).send({
                id: newUser._id,
                lastname: newUser.lastname,
                firstname: newUser.firstname,
                email: newUser.email,
                role: newUser.role,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message || "Impossibe d'enregistrer l'utilisateur",
            });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).send({
                message: "L'utilisateur n'existe pas",
            });
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(401).send({
                message: "Le mot de passe est incorrect",
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
        res.send({
            message: "Connexion réussie",
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                token,
            },
        });
    },

    editUser: async (req, res) => {
        const { id } = req.params;
        const updateData = req.body;
        try {
            const user = await UserModel.findById(id);

            if (!user) {
                return res.status(404).send({
                    message: "Utilisateur inexistant",
                });
            }

            Object.keys(updateData).forEach((key) => {
                if (updateData[key] !== user[key]) {
                    user[key] = updateData[key];
                }
            });

            await user.save();

            res.status(200).send({
                message: "Les nformations de l'utilisateur ont été modifiées avec succès",
                user: user,
            });
        } catch (error) {
            res.status(400).send({
                message: "Erreur lors de la modification des informations de l'utilisateur",
                error: error.message,
            });
        }
    },

    deleteUser: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await UserModel.findByIdAndDelete(id);
            if (!user) {
                return res.status(404).send({
                    message: "Utilisateur introuvable",
                });
            }
            res.send({
                message: "Utilisateur supprimé avec succès",
            });
        } catch (error) {
            res.status(500).send({
                message: error.message || "Erreur lors de la suppression de l'utilisateur",
            });
        }
    },
};
