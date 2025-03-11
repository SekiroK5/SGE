const ParticipacionActividad = require("../models/participiacionActividad");
const Empleado = require("../models/empleado");
const CursosTomados = require("../models/cursosTomados");



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
exports.getAllActividadesParticipacion = async () => {
    return await ParticipacionActividad.find();
};

exports.getactividadesParticipacionById = async (claveEmpleado) => {
    try {
        const empleado = await ParticipacionActividad.findOne({
            ClaveEmpleado: { $regex: new RegExp("^" + claveEmpleado.trim() + "$", "i") }
        });
        
        return empleado;
    } catch (error) {
        throw new Error(`Error al buscar el empleado: ${error.message}`);
    }
};

exports.updateactividadesParticipacion = async (idActividadesParticipacion, updateData) => {
    try {
        const updateObj = {};

        // Campos simples
        const camposDirectos = [
            'ClaveEmpleado', 'NombreCompletoEmpleado',"ParticipacionActividad", 'NombreActividad', 'Estatus',
            'FechaActividad', 'Descripcion'
        ];

        camposDirectos.forEach(campo => {
            if (updateData[campo] !== undefined) {
                updateObj[campo] = updateData[campo];
            }
        });

        if (updateData.FechaActividad) {
            updateObj.FechaActividad = new Date(updateData.FechaActividad);
        }
        

        // Actualizar el curso tomado
        const updatedactividadesParticipacion = await ParticipacionActividad.findByIdAndUpdate(
            idActividadesParticipacion, // Usamos el ObjectId recibido
            updateObj,
            { new: true } // Esta opción asegura que nos devuelva el documento actualizado
        );

        return updatedactividadesParticipacion;
    } catch (error) {
        throw new Error(`Error al actualizar el curso tomado: ${error.message}`);
    }
};

exports.deleteCursoTomado = async (idActividadParticipacion) => {
    try {
        // Realizar la eliminación usando el ObjectId, Mongoose se encarga de la conversión
        const result = await ParticipacionActividad.findByIdAndDelete(idActividadParticipacion);

        if (!result) {
            return null;  // Si no se encuentra el curso
        }

        return result;  // Si se eliminó correctamente
    } catch (error) {
        throw new Error(`Error al eliminar el curso tomado: ${error.message}`);
    }
};