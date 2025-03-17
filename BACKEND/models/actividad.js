const mongoose = require('mongoose');

const actividadSchema = new mongoose.Schema({
  NombreActividad: {
    type: String,
    required: [true, 'El nombre de la actividad es obligatorio'],
    trim: true
  },
  Descripcion: {
    type: String,
    required: [true, 'La descripción de la actividad es obligatoria'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Actividad = mongoose.model('Actividad', actividadSchema);

module.exports = Actividad;