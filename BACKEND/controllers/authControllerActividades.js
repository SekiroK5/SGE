const { encript, compare } = require("../utils/handlePassword");
const participacionActividadService = require("../services/participacionActividadesService");
const mongoose = require("mongoose");
const ParticipacionActividad = require("../models/participiacionActividad");
const Empleado = require("../models/empleado");
const ActividadService = require ("../services/participacionActividadesService")
exports.registrarParticipacionActividad = async (req, res) => {
    console.log(req.body);
    try {
        // Extraer datos recibidos
        const datos = req.body;

        const camposObligatorios = [
            "ClaveEmpleado", "NombreCompletoEmpleado", "ParticipacionActividad"
        ];

        const ActividadesInvalidas = datos.ParticipacionActividad.filter(actividad => {
            return !actividad.NombreActividad || !actividad.Descripcion || !actividad.Estatus || !actividad.FechaActividad;
        });
        
        // Si hay actividades inválidas, generar un mensaje más legible
        if (ActividadesInvalidas.length > 0) {
            const detallesInvalidos = ActividadesInvalidas.map((actividad, index) => {
                const camposFaltantes = [];
                if (!actividad.NombreActividad) camposFaltantes.push("Nombre de la actividad");
                if (!actividad.Descripcion) camposFaltantes.push("Descripción");
                if (!actividad.Estatus) camposFaltantes.push("Estatus");
                if (!actividad.FechaActividad) camposFaltantes.push("Fecha de la actividad");
        
                return `Actividad ${index + 1}: ${camposFaltantes.join(", ")}`;
            });
        
            return res.status(400).json({ error: `Faltan campos en las actividades: ${detallesInvalidos.join(", ")}` });
        }
        
        const participacionActividadData = {
            ClaveEmpleado: datos.ClaveEmpleado,
            NombreCompletoEmpleado: datos.NombreCompletoEmpleado,
            ParticipacionActividad: datos.ParticipacionActividad.map(actividad => ({
                NombreActividad: actividad.NombreActividad,
                Estatus: actividad.Estatus,
                FechaActividad: new Date(actividad.FechaActividad)
            }))
        };

        const newparticipacionActividad = await participacionActividadService.registrarParticipacionActividad(participacionActividadData);

        res.status(201).json({ message: "Curso registrado con éxito", participacionActividad: newparticipacionActividad });

    } catch (error) {
        console.error("Error en el registro del Curso:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


exports.getactividadesParticipacion = async (req, res) => {
    try {
        const actividadesParticipacion = await participacionActividadService.getAllActividadesParticipacion();
        res.status(200).json(actividadesParticipacion);
    } catch (error) {
        console.error("Error al obtener las actividades Tomadas por el empleado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.getactividadesParticipacionById = async (req, res) => {
    try {
        const empleado = await participacionActividadService.getactividadesParticipacionById(req.params.claveEmpleado);
        if (!empleado) {
            return res.status(404).json({ error: "Curso Tomado no encontrado" });
        }
        res.status(200).json(empleado);
    } catch (error) {
        console.error("Error al obtener empleado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


exports.updateactividadesParticipacion = async (req, res) => {
    try {
        const { id } = req.params;  // Tomamos el parámetro 'id'

        // Verificar si el id es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "El id proporcionado no es válido" });
        }

        // Verificar si el curso tomado existe en la base de datos
        const actividadesParticipacion = await ParticipacionActividad.findById(id);  // Buscar el curso por el ObjectId

        if (!actividadesParticipacion) {
            console.log(`la actividad con id ${id} no encontrado.`);
            return res.status(404).json({ error: "Actividad no encontrado" });
        }

        // Verificar si el curso ya ha sido editado
        if (actividadesParticipacion.isEdited) {
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
        const updatedactividadesParticipacion= await ActividadService.updateactividadesParticipacion(id, req.body);

        // Marcar el curso como editado para evitar futuras ediciones
        await ParticipacionActividad.findByIdAndUpdate(id, { isEdited: true });

        res.status(200).json({
            message: "El curso tomado actualizado con éxito",
            actividadesParticipacion: updatedactividadesParticipacion
        });
    } catch (error) {
        console.error("Error al actualizar el curso tomado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.deleteactividadesParticipacion = async (req, res) => {
    try {
        const { id } = req.params;  // Tomamos el parámetro 'id'

        console.log("ID recibido para eliminación:", id);  // Imprimir el ID recibido

        // Verificar si el id es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "El id proporcionado no es válido" });
        }

        // Llamar al servicio para eliminar el curso
        const result = await ActividadService.deleteCursoTomado(id);

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