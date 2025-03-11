const Empleado = require("../models/empleado");
const CursosTomados = require("../models/cursosTomados");
const mongoose = require('mongoose');

exports.registroCursoTomado = async (userData) => {
    try {
        console.log("Datos recibidos en el servicio:", userData);
        
        // Verificar que exista el empleado
        const empleado = await Empleado.findOne({ ClaveEmpleado: userData.ClaveEmpleado });
        if (!empleado) {
            console.log(`Empleado con clave ${userData.ClaveEmpleado} no encontrado.`);
            throw new Error("La clave del empleado no existe.");
        }
        console.log("Empleado encontrado:", empleado);

        // Concatenar el nombre completo desde el empleado
        const nombreCompleto = `${empleado.Nombre} ${empleado.ApellidoPaterno} ${empleado.ApellidoMaterno}`;
        console.log("Nombre completo del empleado:", nombreCompleto);

        // Crear nuevo documento de CursoTomado
        const nuevoCurso = new CursosTomados({
            ClaveEmpleado: userData.ClaveEmpleado,
            NombreCompletoEmpleado: nombreCompleto,
            CursosTomados: userData.CursosTomados
        });
        console.log("Nuevo documento de CursoTomado creado:", nuevoCurso);

        // Guardar en MongoDB
        const result = await nuevoCurso.save();
        console.log("Curso registrado con éxito:", result);

        return result;

    } catch (error) {
        console.error("Error en el servicio de registro de curso:", error);
        throw new Error(`Error al registrar el curso tomado: ${error.message}`);
    }
};
// Añadir a empleadoService.js
exports.getAllCursosTomados = async () => {
    return await CursosTomados.find();
};

exports.getCursoTomadoById = async (claveEmpleado) => {
    try {
        const empleado = await CursosTomados.findOne({
            ClaveEmpleado: { $regex: new RegExp("^" + claveEmpleado.trim() + "$", "i") }
        });
        
        return empleado;
    } catch (error) {
        throw new Error(`Error al buscar el empleado: ${error.message}`);
    }
};

exports.updateCursoTomado = async (idCursoTomado, updateData) => {
    try {
        const updateObj = {};

        // Campos simples
        const camposDirectos = [
            'ClaveEmpleado', 'NombreCompletoEmpleado',"CursosTomados", 'NombreCurso', 'FechaInicio',
            'FechaTermino', 'TipoDocumento', 'Descripcion'
        ];

        camposDirectos.forEach(campo => {
            if (updateData[campo] !== undefined) {
                updateObj[campo] = updateData[campo];
            }
        });

        if (updateData.FechaInicio) {
            updateObj.FechaInicio = new Date(updateData.FechaInicio);
        }
        if (updateData.FechaTermino) {
            updateObj.FechaTermino = new Date(updateData.FechaTermino);
        }

        // Actualizar el curso tomado
        const updatedCursoTomado = await CursosTomados.findByIdAndUpdate(
            idCursoTomado, // Usamos el ObjectId recibido
            updateObj,
            { new: true } // Esta opción asegura que nos devuelva el documento actualizado
        );

        return updatedCursoTomado;
    } catch (error) {
        throw new Error(`Error al actualizar el curso tomado: ${error.message}`);
    }
};


exports.deleteCursoTomado = async (idCursoTomado) => {
    try {
        // Realizar la eliminación usando el ObjectId, Mongoose se encarga de la conversión
        const result = await CursosTomados.findByIdAndDelete(idCursoTomado);

        if (!result) {
            return null;  // Si no se encuentra el curso
        }

        return result;  // Si se eliminó correctamente
    } catch (error) {
        throw new Error(`Error al eliminar el curso tomado: ${error.message}`);
    }
};