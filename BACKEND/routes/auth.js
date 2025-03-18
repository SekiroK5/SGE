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
router.post("/cursosTomados/registrar-cursos", verifyToken, validateRegisterCursos, authControllerCursos.registrarCurso);
router.get('/cursosTomados', verifyToken, authControllerCursos.getCursosTomados);
router.get('/cursosTomados/:claveEmpleado', verifyToken, authControllerCursos.getCursoTomadoById);
router.put('/cursosTomados/:id', verifyToken, authControllerCursos.updateCursoTomado);
router.delete('/cursosTomados/:id', verifyToken, authControllerCursos.deleteCursoTomado);

// Participación en actividad
router.post("/participacionActividadS/registrar-actividad", verifyToken, validateRegisterActividades, authControllerActividades.registrarParticipacionActividad);
router.get('/participacionActividad/', verifyToken, authControllerActividades.getactividadesParticipacion);
router.get('/participacionActividad/:claveEmpleado', verifyToken, authControllerActividades.getactividadesParticipacionById);
router.put('/participacionActividad/:id', verifyToken, authControllerActividades.updateactividadesParticipacion);
router.delete('/participacionActividad/:id', verifyToken, authControllerActividades.deleteactividadesParticipacion);

// Catálogo de actividades
router.post("/actividades/registrar", verifyToken, validateRegistrarActividad, actividadController.registrarActividad);
router.get('/actividades', verifyToken, actividadController.getActividades);
router.get('/actividades/:id', verifyToken, actividadController.getActividadById);
router.put('/actividades/:id', verifyToken, validateRegistrarActividad, actividadController.updateActividad);
router.delete('/actividades/:id', verifyToken, actividadController.deleteActividad);

module.exports = router;