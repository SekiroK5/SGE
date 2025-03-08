const express = require("express");
const router = express.Router();
const {validateRegister, validateLogin} = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");

//Ruta para registrar un empleado
router.post("/register",upload.single("Foto"),validateRegister, authController.register);

//Ruta para el login
router.post("/login",validateLogin, authController.login);

module.exports = router;