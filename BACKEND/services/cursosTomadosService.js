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
        console.log("Datos recibidos para actualización:", JSON.stringify(updateData, null, 2));
        
        // Primero, obtenemos el documento actual para actualizarlo correctamente
        const cursoActual = await CursosTomados.findById(idCursoTomado);
        
        if (!cursoActual) {
            throw new Error(`Curso con id ${idCursoTomado} no encontrado`);
        }
        
        // Creamos un objeto para la actualización que será una copia del documento actual
        let updateObj = {};
        
        // Actualizamos campos simples si están presentes
        if (updateData.ClaveEmpleado) {
            updateObj.ClaveEmpleado = updateData.ClaveEmpleado;
        }
        
        if (updateData.NombreCompletoEmpleado) {
            updateObj.NombreCompletoEmpleado = updateData.NombreCompletoEmpleado;
        }
        
        // Verificamos si solo estamos actualizando fechas
        if (updateData.actualizarFechas === true && 
            updateData.CursosTomados && 
            Array.isArray(updateData.CursosTomados) && 
            updateData.CursosTomados.length > 0) {
            
            console.log("Actualizando solo fechas");
            
            // Creamos una copia profunda de los cursos actuales
            const cursosTomadosActualizados = JSON.parse(JSON.stringify(cursoActual.CursosTomados));
            
            // Actualizamos solo las fechas del primer curso
            if (updateData.CursosTomados[0].FechaInicio) {
                cursosTomadosActualizados[0].FechaInicio = new Date(updateData.CursosTomados[0].FechaInicio);
            }
            
            if (updateData.CursosTomados[0].FechaTermino) {
                cursosTomadosActualizados[0].FechaTermino = new Date(updateData.CursosTomados[0].FechaTermino);
            }
            
            // Asignamos el array actualizado al objeto de actualización
            updateObj.CursosTomados = cursosTomadosActualizados;
            
        } 
        // Si no estamos actualizando fechas, asumimos que queremos actualizar todo el objeto CursosTomados
        else if (updateData.CursosTomados && Array.isArray(updateData.CursosTomados)) {
            console.log("Actualizando el objeto CursosTomados completo");
            updateObj.CursosTomados = updateData.CursosTomados;
        }
        
        console.log("Objeto de actualización:", JSON.stringify(updateObj, null, 2));
        
        // Realizamos la actualización con el objeto preparado
        const updatedCursoTomado = await CursosTomados.findByIdAndUpdate(
            idCursoTomado,
            updateObj,
            { new: true } // Devolver el documento actualizado
        );
        
        return updatedCursoTomado;
    } catch (error) {
        console.error('Error detallado:', error);
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