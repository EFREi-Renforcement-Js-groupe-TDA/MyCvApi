const ReviewModel = require("../models/Review");
const CvModel = require("../models/Cv");
const { getAuthenticatedUser } = require("../utils/Security/SecurityHelper");

module.exports = {
    create: async (req, res) => {
        try {
            const authenticatedUser = await getAuthenticatedUser(req);
            const cv = await CvModel.findById(req.params.id);

            if (!authenticatedUser) {
                return res.status(403).json({
                    message: "Vous devez être connecté(e) pour écrire un commentaire",
                });
            }

            const review = new ReviewModel({
                user: authenticatedUser._id,
                cv: cv._id,
                comment: req.body.comment,
            });

            const savedReview = await review.save();
            cv.review.push(savedReview._id);
            await cv.save();

            res.status(201).send({
                user: review.user,
                cv: review.cv,
                comment: savedReview.comment,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};
