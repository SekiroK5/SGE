const validateRegistrarActividad = (req, res, next) => {
    const { NombreActividad, Descripcion } = req.body;
    const errores = [];
  
    // Validar nombre de actividad
    if (!NombreActividad || NombreActividad.trim() === '') {
      errores.push('El nombre de la actividad es obligatorio');
    }
  
    // Validar descripción
    if (!Descripcion || Descripcion.trim() === '') {
      errores.push('La descripción de la actividad es obligatoria');
    }
  
    // Si hay errores, retornarlos
    if (errores.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errores
      });
    }
  
    // Si no hay errores, continuar
    next();
  };
  
  module.exports = {
    validateRegistrarActividad
  };