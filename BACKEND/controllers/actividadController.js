const Actividad = require('../models/actividad');

// Crear una nueva actividad
exports.registrarActividad = async (req, res) => {
  try {
    const nuevaActividad = new Actividad(req.body);
    await nuevaActividad.save();
    
    res.status(201).json({
      success: true,
      data: nuevaActividad,
      message: 'Actividad registrada correctamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener todas las actividades
exports.getActividades = async (req, res) => {
  try {
    const actividades = await Actividad.find();
    
    res.status(200).json({
      success: true,
      count: actividades.length,
      data: actividades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener una actividad por ID
exports.getActividadById = async (req, res) => {
  try {
    const actividad = await Actividad.findById(req.params.id);
    
    if (!actividad) {
      return res.status(404).json({
        success: false,
        message: 'Actividad no encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      data: actividad
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Actualizar una actividad
exports.updateActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!actividad) {
      return res.status(404).json({
        success: false,
        message: 'Actividad no encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      data: actividad,
      message: 'Actividad actualizada correctamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Eliminar una actividad
exports.deleteActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findByIdAndDelete(req.params.id);
    
    if (!actividad) {
      return res.status(404).json({
        success: false,
        message: 'Actividad no encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Actividad eliminada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};