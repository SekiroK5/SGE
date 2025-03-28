const mongoose = require("mongoose");
const Empleado = require("../models/empleado");
const {Binary} = require("mongodb");
const Departamento = require('../models/departamento');

// Modelo Counter para secuencias numéricas
const Counter = mongoose.model('Counter', new mongoose.Schema({
    _id: String,
    seq: Number
}));

// Middleware para generar ClaveEmpleado y RFC automáticamente
const generarDatosEmpleado = async (userData) => {
    const { Nombre, ApellidoPaterno, ApellidoMaterno, FechaNacimiento } = userData;

    if (!Nombre || !ApellidoPaterno || !ApellidoMaterno || !FechaNacimiento) {
        throw new Error("Faltan datos para generar la ClaveEmpleado y RFC");
    }

    // Generar ClaveEmpleado con iniciales y un consecutivo
    const nombres = Nombre.split(" ");
    const iniciales = (nombres[0][0] + (nombres[1] ? nombres[1][0] : 'X') + ApellidoPaterno[0] + ApellidoMaterno[0]).toUpperCase().slice(0, 4);

    // Usar el contador para obtener un consecutivo único
    const counter = await Counter.findOneAndUpdate(
        { _id: 'empleadoId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    const consecutivo = String(counter.seq).padStart(3, '0');
    
    userData.ClaveEmpleado = `${iniciales}-${consecutivo}`;

    // Generar RFC con iniciales y fecha de nacimiento (YYMMDD)
    let fechaNac = FechaNacimiento;
    if (!(fechaNac instanceof Date)) {
        fechaNac = new Date(fechaNac);
    }
    
    const rfcFecha = fechaNac.getFullYear().toString().slice(2, 4) + 
                    String(fechaNac.getMonth() + 1).padStart(2, '0') + 
                    String(fechaNac.getDate()).padStart(2, '0');
    
    userData.RFC = `${iniciales}-${rfcFecha}`;    

    // Preservar la foto si se proporciona
    if (!userData.Foto || userData.Foto === "") {
        userData.Foto = "https://as2.ftcdn.net/jpg/05/86/91/55/220_F_586915596_gPqgxPdgdJ4OXjv6GCcDWNxTjKDWZ3JD.jpg";
    }

    // Preservar los datos de referencia familiar si existen
    // NO sobreescribir si ya hay datos válidos
    if (!userData.ReferenciaFamiliar || 
        !userData.ReferenciaFamiliar.length || 
        !userData.ReferenciaFamiliar[0].NombreCompleto || 
        userData.ReferenciaFamiliar[0].NombreCompleto === "Por especificar") {
        
        userData.ReferenciaFamiliar = [{
            NombreCompleto: "Por especificar",
            Parentesco: "Por especificar",
            Telefono: [{
                Lada: "000",
                Numero: "0000000"
            }],
            CorreoElectronico: "por.especificar@example.com"
        }];
    }

    return userData;
};

// Se crea un nuevo Empleado
exports.registroEmpleado = async (userData) => {
    try {
        // Verificar si el empleado ya existe por RFC
        const existing = await Empleado.findOne({ RFC: userData.RFC });
        if (existing) {
            throw new Error("El empleado ya existe con este RFC");
        }

        // Generar ClaveEmpleado y RFC antes de guardar
        userData = await generarDatosEmpleado(userData);
        
        // Crear el nuevo empleado
        const newEmpleado = new Empleado(userData);
        //console.log("Datos que se intentan insertar en MongoDB:", userData);
        return await newEmpleado.save();
    } catch (error) {
        throw new Error(`Error al registrar el empleado: ${error.message}`);
    }
};


// Obtener todos los empleados
exports.getAllEmpleados = async () => {
    return await Empleado.find();
};

// Obtener empleado por ID (ClaveEmpleado)
exports.getEmpleadoById = async (claveEmpleado) => {
    try {
        const empleado = await Empleado.findOne({
            ClaveEmpleado: { $regex: new RegExp("^" + claveEmpleado.trim() + "$", "i") }
        });
        
        return empleado;
    } catch (error) {
        throw new Error(`Error al buscar el empleado: ${error.message}`);
    }
};

// Actualizar empleado
exports.updateEmpleado = async (claveEmpleado, updateData) => {
    try {
        // Procesamiento especial para campos anidados
        const updateObj = {};
        
        // Campos simples
        const camposDirectos = [
            'Nombre', 'ApellidoPaterno', 'ApellidoMaterno', 'Sexo', 'Calle',
            'NumeroExterior', 'NumeroInterior', 'Colonia', 'CodigoPostal',
            'Ciudad', 'Departamento', 'Puesto', 'Foto'
        ];
        
        camposDirectos.forEach(campo => {
            if (updateData[campo] !== undefined) {
                updateObj[campo] = updateData[campo];
            }
        });
        
        // Fecha de nacimiento (necesita conversión)
        if (updateData.FechaNacimiento) {
            updateObj.FechaNacimiento = new Date(updateData.FechaNacimiento);
        }
        
        // Manejo de teléfono
        if (updateData.Lada && updateData.Telefono) {
            updateObj['$set'] = updateObj['$set'] || {};
            updateObj['$set']['Telefonos.0.Lada'] = updateData.Lada;
            updateObj['$set']['Telefonos.0.Numero'] = updateData.Telefono;
        }
        
        // Manejo de correo electrónico
        if (updateData.Correo) {
            updateObj['$set'] = updateObj['$set'] || {};
            updateObj['$set']['CorreoElectronico.0.Direccion'] = updateData.Correo;
        }
        
        // Referencia familiar
        if (updateData.ReferenciaNombre || updateData.ReferenciaParentesco || 
            updateData.ReferenciaLada || updateData.ReferenciaTelefono || 
            updateData.ReferenciaCorreo) {
            
            // Crear un objeto para la actualización de referencia
            const referenciaUpdates = {};
            
            if (updateData.ReferenciaNombre) {
                referenciaUpdates['ReferenciaFamiliar.0.NombreCompleto'] = updateData.ReferenciaNombre;
            }
            
            if (updateData.ReferenciaParentesco) {
                referenciaUpdates['ReferenciaFamiliar.0.Parentesco'] = updateData.ReferenciaParentesco;
            }
            
            if (updateData.ReferenciaCorreo) {
                referenciaUpdates['ReferenciaFamiliar.0.CorreoElectronico'] = updateData.ReferenciaCorreo;
            }
            
            if (updateData.ReferenciaLada && updateData.ReferenciaTelefono) {
                referenciaUpdates['ReferenciaFamiliar.0.Telefono.0.Lada'] = updateData.ReferenciaLada;
                referenciaUpdates['ReferenciaFamiliar.0.Telefono.0.Numero'] = updateData.ReferenciaTelefono;
            }
            
            // Agregar al objeto de actualización
            updateObj['$set'] = updateObj['$set'] || {};
            Object.assign(updateObj['$set'], referenciaUpdates);
        }
        
        // Contraseña (requiere cifrado)
        if (updateData.Password) {
            const { encript } = require("../utils/handlePassword");
            updateObj.Password = await encript(updateData.Password);
        }

        // Aplicar la actualización
        const updatedEmpleado = await Empleado.findOneAndUpdate(
            { ClaveEmpleado: { $regex: new RegExp("^" + claveEmpleado.trim() + "$", "i") } },
            updateObj,
            { new: true }
        );
        
        return updatedEmpleado;
    } catch (error) {
        throw new Error(`Error al actualizar el empleado: ${error.message}`);
    }
};

// Eliminar empleado
exports.deleteEmpleado = async (claveEmpleado) => {
    try {
        const result = await Empleado.findOneAndDelete({
            ClaveEmpleado: { $regex: new RegExp("^" + claveEmpleado.trim() + "$", "i") }
        });
        
        return result;
    } catch (error) {
        throw new Error(`Error al eliminar el empleado: ${error.message}`);
    }
};

// Servicio para eliminar temporalmente un empleado
// Importar los modelos necesarios


// Servicio para eliminar temporalmente un empleado
exports.deleteEmpleadoTemporaly = async (claveEmpleado) => {
    try {
        // Buscar al empleado
        const empleado = await Empleado.findOne({ ClaveEmpleado: claveEmpleado });

        if (!empleado) {
            return null; // Empleado no encontrado
        }

        // Guardar el departamento original antes de cambiarlo
        const departamentoOriginal = empleado.Departamento;
        
        // Guardar la información del puesto original si existe
        let puestoOriginal = null;
        
        if (departamentoOriginal && departamentoOriginal !== "Sin asignar") {
            // Buscar el departamento actual para conservar la información del puesto
            const departamentoActual = await Departamento.findOne({ 
                nombreDepartamento: departamentoOriginal 
            });
            
            // Guardar el puesto del empleado en este departamento si existe
            if (departamentoActual && departamentoActual.puestos) {
                // Buscar el puesto del empleado (asumiendo que hay algún identificador del empleado en el puesto)
                puestoOriginal = departamentoActual.puestos.find(
                    puesto => puesto.empleadoId === claveEmpleado || 
                              puesto.ClaveEmpleado === claveEmpleado
                );
            }
        }

        // Cambiar el departamento del empleado a "Sin asignar"
        empleado.Departamento = "Sin asignar";
        
        // Guardar al empleado con el departamento actualizado
        await empleado.save();

        return {
            empleado,
            departamentoOriginal,
            puestoOriginal: puestoOriginal ? puestoOriginal : null
        };
    } catch (error) {
        console.error("Error al eliminar temporalmente al empleado:", error);
        throw error;
    }
};

// Método para activar temporalmente al empleado
exports.activateEmpleadoTemporaly = async (claveEmpleado, departamentoOriginal, puestoOriginal) => {
    try {
        // Buscar al empleado
        const empleado = await Empleado.findOne({ ClaveEmpleado: claveEmpleado });

        if (!empleado) {
            return null; // Empleado no encontrado
        }

        // Verificar si el departamento original es válido
        if (!departamentoOriginal || departamentoOriginal === "Sin asignar") {
            // Si no hay departamento original, mantener "Sin asignar"
            empleado.Departamento = "Asignado";
        } else {
            // Restaurar el departamento original
            empleado.Departamento = departamentoOriginal;
            
            // Si tenemos información del puesto original, asegurarse de que siga existiendo en el departamento
            if (puestoOriginal) {
                const departamento = await Departamento.findOne({ 
                    nombreDepartamento: departamentoOriginal 
                });
                
                if (departamento) {
                    // Verificar si el puesto ya existe o necesita ser restaurado
                    const puestoExiste = departamento.puestos.some(
                        puesto => puesto.empleadoId === claveEmpleado || 
                                  puesto.ClaveEmpleado === claveEmpleado
                    );
                    
                    // Si el puesto no existe, restaurarlo
                    if (!puestoExiste) {
                        departamento.puestos.push(puestoOriginal);
                        await departamento.save();
                    }
                }
            }
        }

        // Guardar al empleado reactivado
        await empleado.save();

        return empleado;
    } catch (error) {
        console.error("Error al activar empleado temporal:", error);
        throw error;
    }
};

exports.getEmpleadoByFilters = async(nombre,departamento) => {
    try{
        var matchStage = {};

        if(nombre){
            matchStage["NombreCompleto"] = {$regex: new RegExp(nombre,'i')};
        }

        if(departamento){
            matchStage["Departamento"] = departamento;
        }

        const results = await Empleado.aggregate([
            {
                $addFields:{
                    NombreCompleto:{
                        $concat: ["$Nombre", " ", "$ApellidoPaterno", " ", "$ApellidoMaterno"]
                    }
                }
            },
            {
                $match: matchStage
            }
        ]);
        
        return results;
    }catch(error){
        console.error("Error al obtener empleado.");
        throw new Error("Error al buscar personas: "+ error.message);
    }
};