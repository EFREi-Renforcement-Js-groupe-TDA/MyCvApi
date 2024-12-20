const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    cv: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cv",
        default: null,
    },

    comment: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Review", ReviewSchema);
