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

// Obtener el empleado por ClaveEmpleado
exports.getEmpleadoByClave = async (ClaveEmpleado) => {
    try {
        const empleado = await Empleado.findOne({
            ClaveEmpleado: { $regex: new RegExp("^" + ClaveEmpleado.trim() + "$", "i") } // Ignorar mayúsculas y minúsculas
        });

        if (!empleado) {
            throw new Error("Empleado no encontrado");
        }

        return empleado;
    } catch (error) {
        throw new Error(`Error al buscar el empleado: ${error.message}`);
    }
};

// Añadir a empleadoService.js
exports.getAllEmpleados = async () => {
    return await Empleado.find();
};

exports.getEmpleadoById = async (id) => {
    return await Empleado.findById(id);
};

exports.updateEmpleado = async (id, data) => {
    return await Empleado.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteEmpleado = async (id) => {
    return await Empleado.findByIdAndDelete(id);
};