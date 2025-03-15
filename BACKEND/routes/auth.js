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
router.get('/empleados/register', authController.getEmpleados);

router.get('/empleados/:claveEmpleado', authController.getEmpleadoById);
router.get('/empleados/:claveEmpleado', authController.getEmpleadoById);
router.put('/empleados/:claveEmpleado', authController.updateEmpleado);
router.delete('/empleados/:claveEmpleado', authController.deleteEmpleado);

//Ruta para registrar un curso
router.post("/cursosTomados/registrar-cursos", validateRegisterCursos, authControllerCursos.registrarCurso);
router.get('/cursosTomados', authControllerCursos.getCursosTomados);
router.get('/cursosTomados/:claveEmpleado',authControllerCursos.getCursoTomadoById);
router.put('/cursosTomados/:id', authControllerCursos.updateCursoTomado);
router.delete('/cursosTomados/:id', authControllerCursos.deleteCursoTomado);


//Ruta para registrar Actividad
router.post("/participacionActividadS/registrar-actividad",validateRegisterActividades,authControllerActividades.registrarParticipacionActividad )
router.get('/participacionActividad/', authControllerActividades.getactividadesParticipacion);
router.get('/participacionActividad/:claveEmpleado', authControllerActividades.getactividadesParticipacionById);
router.put('/participacionActividad/:id', authControllerActividades.updateactividadesParticipacion);
router.delete('/participacionActividad/:id', authControllerActividades.deleteactividadesParticipacion);


//Ruta para el login
router.post("/login",validateLogin, authController.login);

module.exports = router;