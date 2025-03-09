const express = require("express");
const router = express.Router();
const {validateRegister, validateLogin} = require("../middlewares/authMiddleware");
const {validateRegisterCursos} = require("../middlewares/authMiddlewareCursos");
const {validateRegisterActividades} = require("../middlewares/authMiddlewareActividad");
const authControllerActividades= require("../controllers/authControllerActividades");
const authControllerCursos = require("../controllers/authControllerCursos");
const authController = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");


//Ruta para registrar un empleado
router.post("/register",upload.single("Foto"),validateRegister, authController.register);
//Ruta para registrar un curso
router.post("/registrar-cursos", validateRegisterCursos, authControllerCursos.registrarCurso);
//Ruta para registrar Actividad
router.post("/registrar-actividad",validateRegisterActividades,authControllerActividades.registrarParticipacionActividad )


//Ruta para el login
router.post("/login",validateLogin, authController.login);

module.exports = router;