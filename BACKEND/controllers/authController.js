// Al principio de authController.js
require('dotenv').config();
const { encript, compare } = require("../utils/handlePassword");
const empleadoService = require("../services/empleadoService");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "GIAVANA8721";

exports.register = async (req, res) => {
    try {
        // Extraer datos recibidos
        const datos = req.body;
        
        const camposObligatorios = [
            "Nombre", "ApellidoPaterno", "ApellidoMaterno", "FechaNacimiento", 
            "Sexo", "Calle", "NumeroExterior", "Colonia", "CodigoPostal", "Ciudad",
            "Departamento", "Puesto", "Password"
        ];

        const camposFaltantes = camposObligatorios.filter(campo => !datos[campo]);

        if (camposFaltantes.length > 0) {
            return res.status(400).json({ error: `Faltan los siguientes campos: ${camposFaltantes.join(", ")}` });
        }

        // Preparar el objeto de empleado
        const empleadoData = {
            Nombre: datos.Nombre,
            ApellidoPaterno: datos.ApellidoPaterno,
            ApellidoMaterno: datos.ApellidoMaterno,
            FechaNacimiento: new Date(datos.FechaNacimiento),
            Sexo: datos.Sexo,
            Foto: datos.Foto || "",
            Calle: datos.Calle,
            NumeroInterior: datos.NumeroInterior || "",
            NumeroExterior: datos.NumeroExterior,
            Colonia: datos.Colonia,
            CodigoPostal: String(datos.CodigoPostal).padStart(5, '0'),
            Ciudad: datos.Ciudad,
            Departamento: datos.Departamento,
            Puesto: datos.Puesto,
            Password: await encript(datos.Password)
        };

        // Manejar teléfonos - detectar formato y procesar adecuadamente
        if (Array.isArray(datos.Telefonos) && datos.Telefonos.length > 0) {
            // Si ya viene como array, usarlo directamente
            empleadoData.Telefonos = datos.Telefonos;
        } else if (datos.Lada && datos.Telefono) {
            // Si vienen como campos simples, construir el array
            empleadoData.Telefonos = [{ Lada: datos.Lada, Numero: datos.Telefono }];
        } else {
            // Valor por defecto
            empleadoData.Telefonos = [{ Lada: "000", Numero: "0000000" }];
        }

        // Manejar correos electrónicos
        if (Array.isArray(datos.CorreoElectronico) && datos.CorreoElectronico.length > 0) {
            // Si ya viene como array, usarlo directamente
            empleadoData.CorreoElectronico = datos.CorreoElectronico;
        } else if (datos.Correo) {
            // Si viene como campo simple, construir el array
            empleadoData.CorreoElectronico = [{ Direccion: datos.Correo }];
        } else {
            // Valor por defecto
            empleadoData.CorreoElectronico = [{ Direccion: "default@example.com" }];
        }

        // Manejar referencias familiares
        if (Array.isArray(datos.ReferenciaFamiliar) && datos.ReferenciaFamiliar.length > 0) {
            // Si ya viene como array, usarlo directamente
            // Pero asegurarnos que tiene la estructura correcta (CorreoElectronico como string)
            empleadoData.ReferenciaFamiliar = datos.ReferenciaFamiliar.map(ref => {
                // Extraer el correo si viene como array de objetos
                if (Array.isArray(ref.CorreoElectronico) && ref.CorreoElectronico.length > 0) {
                    return {
                        ...ref,
                        CorreoElectronico: ref.CorreoElectronico[0].Direccion || "sin.correo@example.com"
                    };
                }
                return ref;
            });
        } else if (datos.ReferenciaNombre) {
            // Si vienen como campos simples, construir el array
            empleadoData.ReferenciaFamiliar = [{
                NombreCompleto: datos.ReferenciaNombre,
                Parentesco: datos.ReferenciaParentesco || "No especificado",
                Telefono: datos.ReferenciaLada && datos.ReferenciaTelefono ? 
                    [{ Lada: datos.ReferenciaLada, Numero: datos.ReferenciaTelefono }] : 
                    [{ Lada: "000", Numero: "0000000" }],
                CorreoElectronico: datos.ReferenciaCorreo || "sin.correo@example.com"
            }];
        }
        // Si no hay datos de referencia, el middleware generarDatosEmpleado se encargará
        
        const newEmpleado = await empleadoService.registroEmpleado(empleadoData);

        res.status(201).json({ message: "Empleado registrado con éxito", usuario: newEmpleado });

    } catch (error) {
        console.error("Error en el registro del empleado:", error);
        res.status(500).json({ error: "Error interno del servidor: " + error.message });
    }
};

exports.login = async (req, res) => {
    try {
        console.log(req.body);  // Verifica que los datos estén llegando correctamente

        const { ClaveEmpleado, Password } = req.body;

        const empleado = await empleadoService.getEmpleadoById(ClaveEmpleado);

        if (!empleado || !(await compare(Password, empleado.Password))) {
            return res.status(401).json({ error: "Clave de empleado o contraseña incorrectos" });
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                id: empleado._id,
                claveEmpleado: empleado.ClaveEmpleado,
                nombre: empleado.Nombre,
                departamento: empleado.Departamento,
                puesto: empleado.Puesto
            },
            JWT_SECRET,
            { expiresIn: '20s' } // El token expira en 8 horas
        );

        // Devolver token y datos básicos del empleado
        res.status(200).json({
            message: "Sesión iniciada con éxito",
            token,
            usuario: {
                claveEmpleado: empleado.ClaveEmpleado,
                nombre: empleado.Nombre,
                departamento: empleado.Departamento,
                puesto: empleado.Puesto
            }
        });

    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

exports.getEmpleados = async (req, res) => {
    try {
        const empleados = await empleadoService.getAllEmpleados();
        res.status(200).json(empleados);
    } catch (error) {
        console.error("Error al obtener empleados:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

exports.getEmpleadoById = async (req, res) => {
    try {
        const empleado = await empleadoService.getEmpleadoById(req.params.claveEmpleado);
        if (!empleado) {
            return res.status(404).json({ error: "Empleado no encontrado" });
        }
        res.status(200).json(empleado);
    } catch (error) {
        console.error("Error al obtener empleado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

exports.updateEmpleado = async (req, res) => {
    try {
        const updatedEmpleado = await empleadoService.updateEmpleado(req.params.claveEmpleado, req.body);
        if (!updatedEmpleado) {
            return res.status(404).json({ error: "Empleado no encontrado" });
        }
        res.status(200).json({ message: "Empleado actualizado con éxito", empleado: updatedEmpleado });
    } catch (error) {
        console.error("Error al actualizar empleado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

exports.deleteEmpleado = async (req, res) => {
    try {
        const result = await empleadoService.deleteEmpleado(req.params.claveEmpleado);
        if (!result) {
            return res.status(404).json({ error: "Empleado no encontrado" });
        }
        res.status(200).json({ message: "Empleado eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar empleado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// En authController.js
exports.deleteEmpleadoTemporaly = async (req, res) => {
    try {
        const { ClaveEmpleado } = req.params;

        // Llamar al servicio de eliminación temporal
        const { empleado, departamentoOriginal, puestoOriginal } = await empleadoService.deleteEmpleadoTemporaly(ClaveEmpleado);

        if (!empleado) {
            return res.status(404).json({ error: "Empleado no encontrado" });
        }

        // Enviar el departamento original y la información del puesto para restaurarlos al reactivar
        res.status(200).json({
            message: "Empleado eliminado temporalmente",
            departamentoOriginal,
            puestoOriginal
        });
    } catch (error) {
        console.error("Error al eliminar temporalmente al empleado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

exports.activateEmpleadoTemporaly = async (req, res) => {
    try {
        const { ClaveEmpleado } = req.params;
        const { departamentoOriginal, puestoOriginal } = req.body;  // Recibimos tanto el departamento como el puesto original

        const empleado = await empleadoService.activateEmpleadoTemporaly(
            ClaveEmpleado, 
            departamentoOriginal, 
            puestoOriginal
        );

        if (!empleado) {
            return res.status(404).json({ error: "Empleado no encontrado o no se pudo restaurar el departamento" });
        }

        res.status(200).json({ 
            message: "Empleado activado temporalmente",
            empleado: {
                ClaveEmpleado: empleado.ClaveEmpleado,
                Nombre: empleado.Nombre,
                Departamento: empleado.Departamento
            }
        });
    } catch (error) {
        console.error("Error al activar empleado temporal:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


exports.getEmpleadoByFilters = async (req,res) => {
    try{
        const{nombre, departamento} = req.query;

        const results = await empleadoService.getEmpleadoByFilters(nombre,departamento);
        res.json(results);
    }catch(error){
        console.error("Error al obtener empleado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}