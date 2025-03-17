const Actividad = require('../models/actividad');

// Crear una nueva actividad
exports.crearActividad = async (actividadData) => {
  try {
    const nuevaActividad = new Actividad(actividadData);
    return await nuevaActividad.save();
  } catch (error) {
    throw new Error(`Error al crear actividad: ${error.message}`);
  }
};

// Obtener todas las actividades
exports.obtenerActividades = async () => {
  try {
    return await Actividad.find();
  } catch (error) {
    throw new Error(`Error al obtener actividades: ${error.message}`);
  }
};

// Obtener una actividad por ID
exports.obtenerActividadPorId = async (id) => {
  try {
    const actividad = await Actividad.findById(id);
    if (!actividad) {
      throw new Error('Actividad no encontrada');
    }
    return actividad;
  } catch (error) {
    throw new Error(`Error al obtener actividad: ${error.message}`);
  }
};

// Actualizar una actividad
exports.actualizarActividad = async (id, actividadData) => {
  try {
    const actividad = await Actividad.findByIdAndUpdate(
      id,
      actividadData,
      { new: true, runValidators: true }
    );
    
    if (!actividad) {
      throw new Error('Actividad no encontrada');
    }
    
    return actividad;
  } catch (error) {
    throw new Error(`Error al actualizar actividad: ${error.message}`);
  }
};

// Eliminar una actividad
exports.eliminarActividad = async (id) => {
  try {
    const actividad = await Actividad.findByIdAndDelete(id);
    
    if (!actividad) {
      throw new Error('Actividad no encontrada');
    }
    
    return actividad;
  } catch (error) {
    throw new Error(`Error al eliminar actividad: ${error.message}`);
  }
};