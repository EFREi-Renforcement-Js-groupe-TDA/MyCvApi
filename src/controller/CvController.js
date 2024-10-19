const CvModel = require("../models/Cv");
const UserModel = require("../models/User");
const { getAuthenticatedUser, isUserAdmin, isUserOwner } = require("../utils/Security/SecurityHelper");
const { verifyCv } = require("../validator/CvValidator");

const CvController = {
    create: async (req, res) => {
        try {
            const authenticatedUser = await getAuthenticatedUser(req);

            verifyCv(req.body);

            if (!authenticatedUser) {
                return res.status(403).json({
                    message: "Vous devez être connecté(e) pour créer un CV.",
                });
            }

            if (authenticatedUser.cv) {
                return res.status(403).json({
                    message: "Vous avez déjà un CV",
                });
            }

            const cv = new CvModel({
                user: authenticatedUser._id,
                title: req.body.title,
                education: req.body.education,
                experience: req.body.experience,
                biography: req.body.biography,
                skills: req.body.skills,
                softSkills: req.body.softSkills,
                telephone: req.body.telephone,
                linkedin: req.body.linkedin,
                private: req.body.private,
                language: req.body.language,
            });

            const savedCv = await cv.save();
            await UserModel.findByIdAndUpdate(authenticatedUser._id, { cv: savedCv._id });

            res.status(201).send({
                user: authenticatedUser,
                title: savedCv.title,
                education: savedCv.education,
                experience: savedCv.experience,
                biography: savedCv.biography,
                skills: savedCv.skills,
                softSkills: savedCv.softSkills,
                telephone: savedCv.telephone,
                linkedin: savedCv.linkedin,
                private: savedCv.private,
                language: savedCv.language,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        const authenticatedUser = await getAuthenticatedUser(req);
        try {
            const cv = await CvModel.findByIdAndDelete(req.params.id);

            if (!cv) {
                return res.status(404).send({
                    message: "CV non trouvé",
                });
            }

            if (!isUserAdmin(authenticatedUser) && !isUserOwner(authenticatedUser, cv.user)) {
                return res.status(403).send({
                    message: "Vous n'êtes pas autorisé à supprimer ce CV",
                });
            }

            res.status(200).send({
                message: "CV supprimé avec succès",
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const cv = req.params.id ? await CvModel.findById(req.params.id) : null;
            const authenticatedUser = await getAuthenticatedUser(req);

            if (!isUserOwner(authenticatedUser, cv.user)) {
                return res.status(403).send({
                    message: "Vous n'êtes pas autorisé à modifier les informations de ce CV",
                });
            }

            cv.title = req.body.title || cv.title;
            cv.education = req.body.education || cv.education;
            cv.experience = req.body.experience || cv.experience;
            cv.biography = req.body.biography || cv.biography;
            cv.skills = req.body.skills || cv.skills;
            cv.softSkills = req.body.softSkills || cv.softSkills;
            cv.telephone = req.body.telephone || cv.telephone;
            cv.linkedin = req.body.linkedin || cv.linkedin;
            cv.private = req.body.private || cv.private;
            cv.language = req.body.language || cv.language;

            await cv.save();

            res.send({
                message: "CV mis à jour avec succès",
                cv: {
                    id: cv._id,
                    title: cv.title,
                    education: cv.education,
                    experience: cv.experience,
                    biography: cv.biography,
                    skills: cv.skills,
                    softSkills: cv.softSkills,
                    telephone: cv.telephone,
                    linkedin: cv.linkedin,
                    private: cv.private,
                    language: cv.language,
                },
            });
        } catch (error) {
            res.status(500).send({
                message: error.message || "Impossible de mettre à jour les informations",
            });
        }
    },

    findOneCV: async (req, res) => {
        try {
            const cv = await CvModel.findById(req.params.id);

            if (!cv) {
                return res.status(404).send({
                    message: "CV non trouvé",
                });
            }

            res.status(200).send({
                cv: cv,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    findAllCvId: async (req, res) => {
        try {
            const cvs = await CvModel.find({}, "_id");

            if (!cvs.length) {
                return res.status(404).send({
                    message: "Aucun ID de CV trouvé",
                });
            }

            const cvIds = cvs.map((cv) => cv._id);
            res.status(200).send(cvIds);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = CvController;
