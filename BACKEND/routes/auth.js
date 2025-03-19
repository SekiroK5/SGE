const express = require("express");
const router = express.Router();
const {validateRegister, validateLogin} = require("../middlewares/authMiddleware");
const {validateRegisterCursos} = require("../middlewares/authMiddlewareCursos");
const {validateRegisterActividades} = require("../middlewares/authMiddlewareActividad");
const {validateRegistrarActividad} = require("../middlewares/actividadMiddleware");
const authControllerActividades = require("../controllers/authControllerActividades");
const authControllerCursos = require("../controllers/authControllerCursos");
const authController = require("../controllers/authController");
const actividadController = require("../controllers/actividadController");
const upload = require("../middlewares/uploadMiddleware");
const verifyToken = require("../middlewares/verifyTokenMiddleware"); // Importar el middleware

// Ruta pública para autenticación
router.post("/register", upload.single("Foto"), validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);

// Rutas protegidas por token
// Empleados
router.get('/empleados/register', verifyToken, authController.getEmpleados);
router.get('/empleados/:claveEmpleado', verifyToken, authController.getEmpleadoById);
router.put('/empleados/:claveEmpleado', verifyToken, authController.updateEmpleado);
router.delete('/empleados/:claveEmpleado', verifyToken, authController.deleteEmpleado);

// Cursos
router.post("/cursosTomados/registrar-cursos", validateRegisterCursos, authControllerCursos.registrarCurso);
router.get('/cursosTomados', authControllerCursos.getCursosTomados);
router.get('/cursosTomados/:claveEmpleado', verifyToken, authControllerCursos.getCursoTomadoById);
router.put('/cursosTomados/:id', verifyToken, authControllerCursos.updateCursoTomado);
router.delete('/cursosTomados/:id', authControllerCursos.deleteCursoTomado);

// Participación en actividad
router.post("/participacionActividad/registrar-actividad", validateRegisterActividades, authControllerActividades.registrarParticipacionActividad);
router.get('/participacionActividad/', authControllerActividades.getactividadesParticipacion);
router.get('/participacionActividad/:claveEmpleado',  authControllerActividades.getactividadesParticipacionById);
router.put('/participacionActividad/:id',  authControllerActividades.updateactividadesParticipacion);
router.delete('/participacionActividad/:id', authControllerActividades.deleteactividadesParticipacion);

// Catálogo de actividades
router.post("/actividades/registrar",  validateRegistrarActividad, actividadController.registrarActividad);
router.get('/actividades', actividadController.getActividades);
router.get('/actividades/:id', actividadController.getActividadById);
router.put('/actividades/:id', validateRegistrarActividad, actividadController.updateActividad);
router.delete('/actividades/:id', actividadController.deleteActividad);

module.exports = router;