const jwt = require("jsonwebtoken");
const UserModel = require("../../models/User");
const Role = require("../../enum/RolesEnum");

const getAuthenticatedUser = async (req) => {
    let token = req.headers["authorization"].replace("Bearer ", "");
    const { userId } = jwt.verify(token, process.env.JWT_SECRET || "secret");

    return UserModel.findById(userId);
};

const isUserOwner = (requestingUser, ownerUser) => {
    return requestingUser._id.toString() === ownerUser._id.toString();
};

const isUserAdmin = (requestingUser) => {
    return requestingUser.role === Role.ADMIN;
};

module.exports = { getAuthenticatedUser, isUserOwner, isUserAdmin };
