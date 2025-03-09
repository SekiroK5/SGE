const { encript, compare } = require("../utils/handlePassword");
const participacionActividadService = require("../services/participacionActividadesService");
const mongoose = require("mongoose");
const ParticipacionActividad = require("../models/participiacionActividad");
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
