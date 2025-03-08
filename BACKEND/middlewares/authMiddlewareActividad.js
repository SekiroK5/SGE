const { body, validationResult } = require("express-validator");

exports.validateRegisterActividades = [
    body("ClaveEmpleado")
        .exists().withMessage("La clave del empleado es obligatoria")
        .notEmpty().withMessage("La clave del empleado no puede estar vacía"),

    body("NombreCompletoEmpleado")
        .exists().withMessage("El Nombre Completo es obligatorio")
        .notEmpty().withMessage("El Nombre Completo no puede estar vacío"),

    body("ParticipacionActividad")  // Corregido de ParticipacionActividades a ParticipacionActividad
        .exists().withMessage("El campo Participacion Actividades es obligatorio")
        .notEmpty().withMessage("Debe haber al menos una participación registrada")
        .isArray().withMessage("Participacion Actividad debe ser un array de actividades"),

    // Validación de cada actividad dentro de ParticipacionActividad
    body("ParticipacionActividad.*.NombreActividad")
        .exists().withMessage("El Nombre de la Actividad es obligatorio")
        .notEmpty().withMessage("El Nombre de la Actividad no puede estar vacío"),

    body("ParticipacionActividad.*.Descripcion")
        .exists().withMessage("La Descripción es obligatoria")
        .notEmpty().withMessage("La Descripción no puede estar vacía"),

    body("ParticipacionActividad.*.Estatus")
        .exists().withMessage("El Estatus es obligatorio")
        .notEmpty().withMessage("El Estatus no puede estar vacío")
        .isBoolean().withMessage("El Estatus debe ser un valor booleano"),

    body("ParticipacionActividad.*.FechaActividad")
        .exists().withMessage("La Fecha de la Actividad es obligatoria")
        .notEmpty().withMessage("La Fecha de la Actividad no puede estar vacía")
        .isISO8601().withMessage("La Fecha de la Actividad debe ser una fecha válida en formato ISO"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
