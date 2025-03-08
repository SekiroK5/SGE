const ParticipacionActividad = require("../models/participiacionActividad");
const Empleado = require("../models/empleado");


// Registrar una nueva Participación en Actividad
exports.registrarParticipacionActividad = async (userData) => {
    try {
        // Validar existencia del empleado
        const empleado = await Empleado.findOne({ ClaveEmpleado: userData.ClaveEmpleado });

        if (!empleado) {
            throw new Error("La clave del empleado no existe.");
        }

        // Concatenar automáticamente el nombre completo
        const nombreCompleto = `${empleado.Nombre} ${empleado.ApellidoPaterno} ${empleado.ApellidoMaterno}`;

        // Crear la participación
        const nuevaParticipacion = new ParticipacionActividad({
            ClaveEmpleado: userData.ClaveEmpleado,
            NombreCompletoEmpleado: nombreCompleto,
            ParticipacionActividad: userData.ParticipacionActividad
        });
        
        try {
            await nuevaParticipacion.save();
        } catch (error) {
            console.error('Error al guardar participación:', error);
            throw new Error(`Error al registrar participación: ${error.message}`);
        }
        

        // Guardar en MongoDB
        return await nuevaParticipacion.save();

    } catch (error) {
        throw new Error(`Error al registrar participación en actividad: ${error.message}`);
    }
};
