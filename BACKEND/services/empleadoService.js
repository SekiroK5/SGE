const Empleado = require("../models/empleado");
const {Binary} = require("mongodb");

// Middleware para generar ClaveEmpleado y RFC automáticamente
const generarDatosEmpleado = async (userData) => {
    const { Nombre, ApellidoPaterno, ApellidoMaterno, FechaNacimiento } = userData;

    if (!Nombre || !ApellidoPaterno || !ApellidoMaterno || !FechaNacimiento) {
        throw new Error("Faltan datos para generar la ClaveEmpleado y RFC");
    }

    // Generar ClaveEmpleado con iniciales y un consecutivo
    const nombres = Nombre.split(" "); // Separa los nombres en caso de que haya más de uno
    const iniciales = (nombres[0][0] + (nombres[1] ? nombres[1][0] : 'X') + ApellidoPaterno[0] + ApellidoMaterno[0]).toUpperCase().slice(0, 4);

    const lastEmpleado = await Empleado.findOne().sort({ ClaveEmpleado: -1 }).select("ClaveEmpleado");
    let consecutivo = "001";
    if (lastEmpleado) {
        const lastNum = parseInt(lastEmpleado.ClaveEmpleado.split('-')[1]) || 0;
        consecutivo = String(lastNum + 1).padStart(3, '0');
    }
    userData.ClaveEmpleado = `${iniciales}-${consecutivo}`;

    // Generar RFC con iniciales y fecha de nacimiento (YYMMDD)
    if (!(FechaNacimiento instanceof Date)) {
        FechaNacimiento = new Date(FechaNacimiento);
    }
    
    const rfcFecha = FechaNacimiento.getFullYear().toString().slice(2, 4) + 
                     String(FechaNacimiento.getMonth() + 1).padStart(2, '0') + 
                     String(FechaNacimiento.getDate()).padStart(2, '0');
    
    userData.RFC = `${iniciales}-${rfcFecha}`;    

    //Convertimos la foto a bin data
    userData.Foto = userData.Foto ? new Binary(userData.Foto) : new Binary(Buffer.alloc(0));

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
            'Ciudad', 'Departamento', 'Puesto'
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