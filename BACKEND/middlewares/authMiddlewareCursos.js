const { body, validationResult } = require("express-validator");

exports.validateRegisterCursos = [
    body("ClaveEmpleado")
        .exists().withMessage("La clave del empleado es obligatorio")
        .notEmpty().withMessage("La clave del empleado no puede estar vacío"),

    body("NombreCompletoEmpleado")
        .exists().withMessage("El Nombre Completo es obligatorio")
        .notEmpty().withMessage("El Nombre Completo no puede estar vacío"),

    body("CursosTomados")
        .exists().withMessage("El campo CursosTomados es obligatorio")
        .notEmpty().withMessage("Debe haber al menos un curso tomado")
        .isArray().withMessage("CursosTomados debe ser un array de cursos"),

    // Validación de cada curso dentro del array de CursosTomados
    body("CursosTomados.*.NombreCurso")
        .exists().withMessage("El Nombre del curso es obligatorio")
        .notEmpty().withMessage("El nombre del curso no puede estar vacío"),

    body("CursosTomados.*.FechaInicio")
        .exists().withMessage("La fecha de Inicio es obligatoria")
        .notEmpty().withMessage("La fecha de Inicio no puede estar vacía")
        .isISO8601().withMessage("La fecha de Inicio debe estar en formato ISO (YYYY-MM-DD)"),

    body("CursosTomados.*.FechaTermino")
        .exists().withMessage("La fecha de termino es obligatoria")
        .notEmpty().withMessage("La fecha de termino no puede estar vacía")
        .isISO8601().withMessage("La fecha de termino debe estar en formato ISO (YYYY-MM-DD)"),

    body("CursosTomados.*.TipoDocumento")
        .exists().withMessage("El Tipo de Documento es obligatorio")
        .notEmpty().withMessage("El Tipo de Documento no puede estar vacío")
        .isArray().withMessage("TipoDocumento debe ser un array de objetos"),

    // Si todo está bien, pasa al siguiente middleware
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
