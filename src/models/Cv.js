const mongoose = require("mongoose");

const CvSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        autopopulate: true,
    },

    title: {
        type: String,
        required: true,
    },

    education: [
        {
            school: String,
            formation: String,
            description: String,
            startDate: Number,
            endDate: Number,
        },
    ],

    experience: [
        {
            compagny: String,
            position: String,
            startDate: Number,
            endDate: Number,
        },
    ],

    biography: {
        type: String,
        required: true,
    },

    skills: [String],

    softSkills: [String],

    telephone: {
        type: Number,
        required: true,
    },

    linkedin: {
        type: String,
        required: true,
    },

    private: {
        type: Boolean,
        default: true,
    },

    language: [String],
});

CvSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Cv", CvSchema);
