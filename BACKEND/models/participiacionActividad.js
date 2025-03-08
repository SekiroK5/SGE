const mongoose = require('mongoose');
const { Schema } = mongoose;

// Función de validación para arrays (si se necesita)
function arrayLimit(val) {
    return val.length >= 1;
}

// Esquema ParticipaciónActividad (individual)
const ParticipacionActividadSchema = new Schema({
    NombreActividad: { type: String, required: true },
    Estatus: { type: Boolean, required: true },           // true = participó, false = no participó
    FechaActividad: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(value) {
                return !isNaN(new Date(value)); // Validación para asegurar que la fecha sea válida
            },
            message: 'La fecha de actividad debe ser una fecha válida.'
        }
    }
});

// Esquema principal (registro de participaciones del empleado)
const PActividadSchema = new Schema({
    ClaveEmpleado: {
        type: String,
        required: true,
        validate: {
            validator: async function(valor) {
                const Empleado = mongoose.model('Empleado');
                const existeEmpleado = await Empleado.exists({ ClaveEmpleado: valor });
                return existeEmpleado;
            },
            message: 'La clave del empleado no existe.'
        }
    },
    NombreCompletoEmpleado: {
        type: String,
        required: true
    },
    ParticipacionActividad: {  // Cambié el nombre de 'ParticipacionActividades' a 'ParticipacionActividad'
        type: [ParticipacionActividadSchema],
        required: true,
        validate: [arrayLimit, 'Debe haber al menos una participación registrada']
    }
}, {
    timestamps: true
});

// Middleware para concatenar automáticamente el nombre del empleado
PActividadSchema.pre('validate', async function(next) {
    try {
        const empleado = await mongoose.model('Empleado').findOne({ ClaveEmpleado: this.ClaveEmpleado });

        if (!empleado) {
            throw new Error('Empleado no encontrado al concatenar nombre.');
        }

        this.NombreCompletoEmpleado = `${empleado.Nombre} ${empleado.ApellidoPaterno} ${empleado.ApellidoMaterno}`;
        next();
    } catch (error) {
        next(error);
    }
});

// Creación del modelo
const ParticipacionActividad = mongoose.model('ParticipacionActividad', PActividadSchema, 'ParticipacionActividad');

module.exports = ParticipacionActividad;
