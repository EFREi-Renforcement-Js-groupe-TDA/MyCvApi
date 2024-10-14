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

    editInfo: async (req, res) => {
        try {
            let token = req.headers["authorization"].replace("Bearer ", "");
            const { userId } = jwt.verify(token, process.env.JWT_SECRET || "secret");
            const requestingUser = await UserModel.findById(userId);
            const user = await UserModel.findById(req.params.id);

            if (requestingUser.role !== Role.ADMIN && requestingUser._id.toString() !== user._id.toString()) {
                return res.status(403).send({
                    message: "Vous n'êtes pas autorisé à changer les informations de cet utilisateur.",
                });
            }

            user.firstname = req.body.firstname || user.firstname;
            user.lastname = req.body.lastname || user.lastname;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = await bcrypt.hash(req.body.password, 10);
            }
            user.role = req.body.role || user.role;

            await user.save();

            res.send({
                message: "Informations mis à jour avec succès",
                user: {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (error) {
            res.status(500).send({
                message: error.message || "Impossible de mettre à jour les informations",
            });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const user = await UserModel.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).send({
                    message: "Utilisateur non trouvé",
                });
            }
            res.send({
                message: "Utilisateur supprimé avec succès",
            });
        } catch (error) {
            res.status(500).send({
                message: error.message || "Impossible de supprimer l'utilisateur",
            });
        }
    },
};
