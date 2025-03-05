const { body, validationResult } = require("express-validator");

// Middleware para validar el registro de empleado
exports.validateRegister = [
/*  body("RFC")
    .exists().withMessage("El RFC es obligatorio")
    .notEmpty().withMessage("El RFC no puede estar vacío")
    .matches(/^[A-Z]{4}-\d{6}$/).withMessage("El RFC debe tener el formato XXXX-YYMMDD"),
*/
  body("Nombre")
    .exists().withMessage("El nombre es obligatorio")
    .notEmpty().withMessage("El nombre no puede estar vacío"),

  body("ApellidoPaterno")
    .exists().withMessage("El apellido paterno es obligatorio")
    .notEmpty().withMessage("El apellido paterno no puede estar vacío"),

  body("ApellidoMaterno")
    .exists().withMessage("El apellido materno es obligatorio")
    .notEmpty().withMessage("El apellido materno no puede estar vacío"),

  body("FechaNacimiento")
    .exists().withMessage("La fecha de nacimiento es obligatoria")
    .notEmpty().withMessage("La fecha de nacimiento no puede estar vacía")
    .isISO8601().withMessage("La fecha de nacimiento debe estar en formato ISO (YYYY-MM-DD)"),

  body("Sexo")
    .exists().withMessage("El sexo es obligatorio")
    .isIn(["M", "F"]).withMessage("El sexo debe ser 'M' o 'F'"),

  body("CorreoElectronico.*.Direccion")
    .exists().withMessage("El correo electrónico es obligatorio")
    .notEmpty().withMessage("El correo electrónico no puede estar vacío")
    .isEmail().withMessage("El correo electrónico no es válido"),

  body("Password")
    .exists().withMessage("La contraseña es obligatoria")
    .notEmpty().withMessage("La contraseña no puede estar vacía")
    .isLength({ min: 6, max: 20 }).withMessage("La contraseña debe tener entre 6 y 20 caracteres"),

  body("Telefonos.*.Lada")
    .exists().withMessage("La lada es obligatoria")
    .matches(/^\d{2,3}$/).withMessage("La lada debe tener entre 2 y 3 dígitos"),

  body("Telefonos.*.Numero")
    .exists().withMessage("El número de teléfono es obligatorio")
    .matches(/^\d{7,10}$/).withMessage("El número de teléfono debe tener entre 7 y 10 dígitos"),

  body("Calle")
    .exists().withMessage("La calle es obligatoria")
    .notEmpty().withMessage("La calle no puede estar vacía"),

  body("NumeroExterior")
    .exists().withMessage("El número exterior es obligatorio")
    .notEmpty().withMessage("El número exterior no puede estar vacío"),

  body("Colonia")
    .exists().withMessage("La colonia es obligatoria")
    .notEmpty().withMessage("La colonia no puede estar vacía"),

  body("CodigoPostal")
    .exists().withMessage("El código postal es obligatorio")
    .matches(/^\d{5}$/).withMessage("El código postal debe tener 5 dígitos"),

  body("Ciudad")
    .exists().withMessage("La ciudad es obligatoria")
    .notEmpty().withMessage("La ciudad no puede estar vacía"),

  body("Departamento")
    .exists().withMessage("El departamento es obligatorio"),

  body("Puesto")
    .exists().withMessage("El puesto es obligatorio"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware para validar el login
exports.validateLogin = [
  body("ClaveEmpleado")
    .exists().withMessage("La clave de empleado es obligatoria")
    .notEmpty().withMessage("La clave de empleado no puede estar vacía"),

  body("Password")
    .exists().withMessage("La contraseña es obligatoria")
    .notEmpty().withMessage("La contraseña no puede estar vacía")
    .isLength({ min: 6, max: 20 }).withMessage("La contraseña debe tener entre 6 y 20 caracteres"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];