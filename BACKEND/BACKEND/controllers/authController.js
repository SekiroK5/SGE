const { encript, compare } = require("../utils/handlePassword");
const empleadoService = require("../services/empleadoService");
const mongoose = require("mongoose");
exports.register = async (req, res) => {
    try {
        // Extraer datos recibidos
        const datos = req.body;

        const camposObligatorios = [
            "Nombre", "ApellidoPaterno", "ApellidoMaterno", "FechaNacimiento", 
            "Sexo", "Calle", "NumeroExterior", "Colonia", "CodigoPostal", "Ciudad",
            "Departamento", "Puesto", "Lada", "Telefono", "Correo", "Password"
        ];

        const camposFaltantes = camposObligatorios.filter(campo => !datos[campo]);

        if (camposFaltantes.length > 0) {
            return res.status(400).json({ error: `Faltan los siguientes campos: ${camposFaltantes.join(", ")}` });
        }

        let fotoBuffer = req.file ? req.file.buffer : null;

        const empleadoData = {
            Nombre: datos.Nombre,
            ApellidoPaterno: datos.ApellidoPaterno,
            ApellidoMaterno: datos.ApellidoMaterno,
            FechaNacimiento: new Date(datos.FechaNacimiento), // Convertir a Date
            Sexo: datos.Sexo,
            Foto: req.file ? new mongoose.Types.Buffer(req.file.buffer) : Buffer.alloc(0),
            Calle: datos.Calle,
            NumeroInterior: datos.NumeroInterior || "",
            NumeroExterior: datos.NumeroExterior,
            Colonia: datos.Colonia,
            CodigoPostal: String(datos.CodigoPostal).padStart(5, '0'),
            Ciudad: datos.Ciudad,
            Departamento: datos.Departamento,
            Puesto: datos.Puesto,
            Telefonos: datos.Lada && datos.Telefono ? [{ Lada: datos.Lada, Numero: datos.Telefono }] : [{ Lada: "000", Numero: "0000000" }],
            CorreoElectronico: datos.Correo ? [{ Direccion: datos.Correo }] : [{ Direccion: "default@example.com" }],
            ReferenciaFamiliar: datos.ReferenciaNombre ? [
                {
                    NombreCompleto: datos.ReferenciaNombre,
                    Parentesco: datos.ReferenciaParentesco || "",
                    Telefono: datos.ReferenciaLada && datos.ReferenciaTelefono ? [
                        { Lada: datos.ReferenciaLada, Numero: datos.ReferenciaTelefono }
                    ] : [],
                    CorreoElectronico: datos.ReferenciaCorreo || ""
                }
            ] : [],                  
            Password: await encript(datos.Password)
        };
        

        const newEmpleado = await empleadoService.registroEmpleado(empleadoData);

        res.status(201).json({ message: "Empleado registrado con éxito", usuario: newEmpleado });

    } catch (error) {
        console.error("Error en el registro del empleado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

exports.login = async (req, res) => {
    try {
        console.log(req.body);  // Verifica que los datos estén llegando correctamente

        const { ClaveEmpleado, Password } = req.body;

        const empleado = await empleadoService.getEmpleadoByClave(ClaveEmpleado);

        if (!empleado || !(await compare(Password, empleado.Password))) {
            return res.status(401).json({ error: "Clave de empleado o contraseña incorrectos" });
        }

        res.status(200).json({ message: "Sesión iniciada con éxito" });

    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
