const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("./../models/User");
const { verifyUser } = require("../validator/user");

module.exports = {
    register: async (req, res) => {
        try {
            verifyUser(req.body);
            const { firstname, lastname, email, password } = req.body;

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
            });

            await newUser.save();
            res.status(201).send({
                id: newUser._id,
                lastname: newUser.lastname,
                firstname: newUser.firstname,
                email: newUser.email,
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
                message: "User not exist",
            });
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(401).send({
                message: "Incorrect password",
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
        res.send({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                token,
            },
        });
    },
};
