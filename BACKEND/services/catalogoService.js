const Departamento = require("../models/departamento");
const Actividad = require("../models/actividad");
const Parentesco = require("../models/parentesco");
const Documento = require ("../models/documento");

exports.getActividades = async() =>{
    try{
        const actividades = await Actividad.find({},{_id:0,NombreActividad:1}).sort({NombreActividad : 1});

        if (!actividades){
            throw new Error("No se encontraron actividades.");
        }
        return actividades;
    }catch(error){
        throw new Error("Error al buscar las actividades: ", error.message);
    }
}

exports.getDepartamentos = async() => {
    try{
        const departamentos = await Departamento.find({},{_id:0,NombreDepartamento:1}).sort({NombreDepartamento : 1});

        if(!departamentos){
            throw new Error("No se encontraron departamentos.");
        }

        return departamentos;
    }catch(error){
        throw new Error("Error al buscar los departamentos: ", error.message);
    }
}

exports.getParentescos = async() =>{
    try{

        const parentescos = await Parentesco.find({},{_id:0,TipoParentesco:1}).sort({TipoParentesco:1})

        if(!parentescos){
            throw new Error("No se encontraron parentescos.");
        }

        return parentescos;
    }catch(error){
        throw new Error("Error al buscar los parentescos: ", error.message);
    }
}

exports.getPuestos = async(departamento) =>{
    try{
        const pipeline =[
            {$unwind: "$Puestos"},
            {$match:departamento},
            { $project: { "Puestos.Nombre": 1, _id: 0 } }
        ];

        const puestos = await Departamento.aggregate(pipeline);

        if(!puestos){
            throw new Error("No se encontraron puestos");
        }

        const nombresPuestos = puestos.map(puesto => puesto.Puestos.Nombre);

        return nombresPuestos;
    }catch(error){
        throw new Error("Error al obtener los puestos: "+ error.message);
    }
}


exports.getDocumentos = async () => {
    try {
        const documentos = await Documento.find({}, { _id: 0, TipoDocumento: 1, Descripcion: 1 }).sort({ TipoDocumento: 1 });

        if (!documentos || documentos.length === 0) {
            throw new Error("No se encontraron documentos.");
        }

        return documentos;
    } catch (error) {
        throw new Error("Error al obtener los documentos: " + error.message);
    }
};