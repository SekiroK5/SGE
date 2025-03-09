const Empleado = require("../models/empleado");
const CursosTomados = require("../models/cursosTomados");

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
