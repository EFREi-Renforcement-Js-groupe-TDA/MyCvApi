const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("./../models/User");
const Role = require("../enum/RolesEnum");

module.exports = {
    edit: async (req, res) => {
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

    delete: async (req, res) => {
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
