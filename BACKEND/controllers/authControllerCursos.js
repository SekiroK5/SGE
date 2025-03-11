
const cursoService = require("../services/cursosTomadosService");
const CursosTomados = require('../models/cursosTomados');  
const Empleado = require('../models/empleado');  
const mongoose = require('mongoose');
exports.registrarCurso = async (req, res) => {
    console.log("Datos recibidos:", req.body);  // Verifica cómo llegan los datos
    
    try {
        const datos = req.body;

        const camposObligatorios = [
            "ClaveEmpleado", "NombreCompletoEmpleado", "CursosTomados"
        ];

        const camposFaltantes = camposObligatorios.filter(campo => !datos[campo]);

        if (camposFaltantes.length > 0) {
            return res.status(400).json({ error: `Faltan los siguientes campos: ${camposFaltantes.join(", ")}` });
        }

        // Revisa que CursosTomados sea un array y tenga al menos un curso
        if (!Array.isArray(datos.CursosTomados) || datos.CursosTomados.length === 0) {
            return res.status(400).json({ error: "El campo CursosTomados debe ser un array no vacío" });
        }
        const cursosTomadosInvalidos = datos.CursosTomados.filter(curso => {
            return !curso.NombreCurso || !curso.FechaInicio || !curso.FechaTermino || !curso.TipoDocumento;
        });

        if (cursosTomadosInvalidos.length > 0) {
            return res.status(400).json({ error: "Faltan los siguientes campos dentro de CursosTomados: NombreCurso, FechaInicio, FechaTermino, TipoDocumento" });
        }
        const CursosTomadosData = {
            ClaveEmpleado: datos.ClaveEmpleado,
            NombreCompletoEmpleado: datos.NombreCompletoEmpleado,
            CursosTomados: datos.CursosTomados.map(curso => ({
                NombreCurso: curso.NombreCurso,
                FechaInicio: new Date(curso.FechaInicio),
                FechaTermino: new Date(curso.FechaTermino),
                TipoDocumento: curso.TipoDocumento.map(documento => ({
                    Descripcion: documento.Descripcion  // Procesar el array de TipoDocumento
                }))
            }))
        };

        console.log("Datos de CursosTomadosData:", CursosTomadosData);

        const newCursos = await cursoService.registroCursoTomado(CursosTomadosData);

        res.status(201).json({ message: "Curso registrado con éxito", curso: newCursos });

    } catch (error) {
        console.error("Error en el registro del Curso:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// GetCursosTomados
exports.getCursosTomados = async (req, res) => {
    try {
        const cursosTomado = await cursoService.getAllCursosTomados();
        res.status(200).json(cursosTomado);
    } catch (error) {
        console.error("Error al obtener los cursos tomados por el empleado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

exports.getCursoTomadoById = async (req, res) => {
    try {
        const empleado = await cursoService.getCursoTomadoById(req.params.claveEmpleado);
        if (!empleado) {
            return res.status(404).json({ error: "Curso Tomado no encontrado" });
        }
        res.status(200).json(empleado);
    } catch (error) {
        console.error("Error al obtener empleado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.updateCursoTomado = async (req, res) => {
    try {
        const { id } = req.params;  // Tomamos el parámetro 'id'

        // Verificar si el id es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "El id proporcionado no es válido" });
        }

        // Verificar si el curso tomado existe en la base de datos
        const cursoTomado = await CursosTomados.findById(id);  // Buscar el curso por el ObjectId

        if (!cursoTomado) {
            console.log(`CursoTomado con id ${id} no encontrado.`);
            return res.status(404).json({ error: "CursoTomado no encontrado" });
        }

        // Verificar si el curso ya ha sido editado
        if (cursoTomado.isEdited) {
            console.log(`El curso con id ${id} ya ha sido editado y no puede ser modificado nuevamente.`);
            return res.status(400).json({ error: "Este curso ya ha sido editado y no puede ser modificado nuevamente" });
        }

        // Verificar si el empleado relacionado existe usando la ClaveEmpleado del curso
        const empleado = await Empleado.findOne({ ClaveEmpleado: req.body.ClaveEmpleado });
        
        if (!empleado) {
            console.log(`Empleado con clave ${req.body.ClaveEmpleado} no encontrado.`);
            return res.status(404).json({ error: "Empleado relacionado no encontrado" });
        }

        // Llamar al servicio para actualizar el curso tomado
        const updatedCursoTomado = await cursoService.updateCursoTomado(id, req.body);

        // Marcar el curso como editado para evitar futuras ediciones
        await CursosTomados.findByIdAndUpdate(id, { isEdited: true });

        res.status(200).json({
            message: "El curso tomado actualizado con éxito",
            cursoTomado: updatedCursoTomado
        });
    } catch (error) {
        console.error("Error al actualizar el curso tomado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.deleteCursoTomado = async (req, res) => {
    try {
        const { id } = req.params;  // Tomamos el parámetro 'id'

        console.log("ID recibido para eliminación:", id);  // Imprimir el ID recibido

        // Verificar si el id es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "El id proporcionado no es válido" });
        }

        // Llamar al servicio para eliminar el curso
        const result = await cursoService.deleteCursoTomado(id);

        // Si no se encuentra el curso, responder con error
        if (!result) {
            console.log("No se encontró el curso con el id:", id);  // Imprimir si no se encuentra el curso
            return res.status(404).json({ error: "CursoTomado no encontrado" });
        }

        // Si se eliminó correctamente, responder con mensaje de éxito
        res.status(200).json({ message: "Curso Tomado eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar el curso tomado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
