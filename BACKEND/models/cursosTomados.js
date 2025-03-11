const mongoose = require('mongoose');
const { Schema } = mongoose;

// Esquema de TipoDocumento
const TipoDocumentoSchema = new Schema({
    Descripcion: { type: String, required: true }
});


// Esquema de CursoTomado
const CursoTomadoSchema = new Schema({
    NombreCurso: { type: String, required: true },
    FechaInicio: { type: Date, required: true },
    FechaTermino: { type: Date, required: true },
    TipoDocumento: {
        type: [TipoDocumentoSchema],
        required: true,
        validate: [arrayLimit, 'Debe tener al menos algún documento']
    }
},
{ collection: 'CursosTomados' },
{ timestamps: true }); 

// Esquema principal CursosTomados
const CursosTomadosSchema = new Schema({
    ClaveEmpleado: { type: String, required: true },
    NombreCompletoEmpleado: { type: String, required: true },
    CursosTomados: { // Array de cursos
        type: [CursoTomadoSchema],
        required: true,
        validate: [arrayLimit, 'Debe tener al menos un curso tomado']
    }
},{ collection: 'CursosTomados' });

// Función de validación para arrays (validar que haya al menos un elemento)
function arrayLimit(val) {
    return val.length >= 1;
}

// Middleware para concatenar automáticamente el nombre del empleado
CursosTomadosSchema.pre('validate', async function(next) {
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

// Creación del modelo (sin pasar el nombre de la colección en este caso)
const CursosTomados = mongoose.model('CursosTomados', CursosTomadosSchema);

module.exports = CursosTomados;
