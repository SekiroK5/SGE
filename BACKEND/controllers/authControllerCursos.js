
const cursoService = require("../services/cursosTomadosService");

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
