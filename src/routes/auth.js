const router = require("express").Router();
const autController = require("./../controller/auth");

router.post("/register", autController.register);

router.post("/login", autController.login);

module.exports = router;
