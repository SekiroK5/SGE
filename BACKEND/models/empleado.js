const mongoose = require('mongoose');
const { Schema } = mongoose;

// Esquema de Teléfono
const TelefonoSchema = new Schema({
    Lada: {
        type: String,
        required: true,
        match: /^\d{2,3}$/
    },
    Numero: {
        type: String,
        required: true,
        match: /^\d{7,10}$/
    }
});

// Esquema de Correo Electrónico
const CorreoSchema = new Schema({
    Direccion: {
        type: String,
        required: true,
        trim: true,
        match: /^\S+@\S+\.\S+$/
    }
});

// Esquema de Referencias Familiares
const FamiliarSchema = new Schema({
    NombreCompleto: {
        type: String,
        required: true
    },
    Parentesco: {
        type: String,
        required: true
    },
    Telefono: {
        type: [TelefonoSchema],
        required: true,
        validate: [arrayLimit, 'Debe tener al menos un número telefónico']
    },
    CorreoElectronico: {
        type: String,
        required: true,
        match: /^\S+@\S+\.\S+$/
    }
});

// Esquema de Empleado
const EmpleadoSchema = new Schema({
    ClaveEmpleado: {
        type: String,
        required: true,
        unique: true
    },
    Nombre: {
        type: String,
        required: true
    },
    ApellidoPaterno: {
        type: String,
        required: true
    },
    ApellidoMaterno: {
        type: String,
        required: true
    },
    RFC: {
        type: String,
        required: true,
        unique: true,
        match: /^[A-Z]{4}-\d{6}$/  // Formato SIGR-770910
    },
    FechaNacimiento: {
        type: Date,
        required: true
    },
    Sexo: {
        type: String,
        required: true,
        enum: ['M', 'F']
    },
    Foto: {
        type: String,
        required: false,
        default: "https://as2.ftcdn.net/jpg/05/86/91/55/220_F_586915596_gPqgxPdgdJ4OXjv6GCcDWNxTjKDWZ3JD.jpg"
    },
    Calle: {
        type: String,
        required: true
    },
    NumeroInterior: {
        type: String,
        required: false
    },
    NumeroExterior: {
        type: String,
        required: true
    },
    Colonia: {
        type: String,
        required: true
    },
    CodigoPostal: {
        type: String,
        required: true,
        match: /^\d{5}$/ 
    },
    Ciudad: {
        type: String,
        required: true
    },
    Departamento: {
        type: String,
        required: true
    },
    Puesto: {
        type: String,
        required: true
    },
    Telefonos: {
        type: [TelefonoSchema],
        required: true,
        validate: [arrayLimit, 'Debe tener al menos un teléfono']
    },
    CorreoElectronico: {
        type: [CorreoSchema],
        required: true,
        validate: [arrayLimit, 'Debe tener al menos un correo electrónico']
    },
    ReferenciaFamiliar: {
        type: [FamiliarSchema],
        required: true,
        validate: [arrayLimit, 'Debe tener al menos una referencia familiar']
    },
    Password: {
        type: String,
        required: true
    }
}, 
{
    timestamps: {
        createdAt: 'FechaCreacion',
        updatedAt: 'FechaUltimaModificacion'
    }
});

// Función de validación para arrays
function arrayLimit(val) {
    return val.length >= 1;
}

// Creación del modelo
const Empleado = mongoose.model('Empleado', EmpleadoSchema, 'Empleado');

module.exports = Empleado;