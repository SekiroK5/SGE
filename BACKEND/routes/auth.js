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
const verifyToken = require("../middlewares/verifyTokenMiddleware"); 
const catalogosController = require('../controllers/catalogoController');
// Importar el middleware

// Ruta pública para autenticación
router.post("/register", upload.single("Foto"), validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);

// Rutas protegidas por token
// Empleados
router.get('/empleados', authController.getEmpleados);
router.get('/empleados/:claveEmpleado',  authController.getEmpleadoById);
router.put('/empleados/:claveEmpleado',  authController.updateEmpleado);
router.delete('/empleados/:claveEmpleado',  authController.deleteEmpleado);
router.put("/desactiva/:ClaveEmpleado", authController.deleteEmpleadoTemporaly);
router.put("/activa/:ClaveEmpleado", authController.activateEmpleadoTemporaly);
router.get("/buscar", authController.getEmpleadoByFilters);

// Cursos
router.post("/cursosTomados/registrar-cursos", validateRegisterCursos, authControllerCursos.registrarCurso);
router.get('/cursosTomados', authControllerCursos.getCursosTomados);
router.get('/cursosTomados/:claveEmpleado', authControllerCursos.getCursoTomadoById);
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


// Catalogos
router.get("/departamento",catalogosController.getDepartamentos);
router.get("/puesto/:NombreDepartamento",catalogosController.getPuestos);
router.get("/parentesco",catalogosController.getParentescos);
router.get("/actividad",catalogosController.getActividades);
router.get('/documentos', catalogosController.getDocumentos);
module.exports = router;